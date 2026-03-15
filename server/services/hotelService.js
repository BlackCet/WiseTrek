import axios from "axios";
import { generateHotelReview } from "./geminiReviewService.js";

export const fetchHotelsFromSerpAPI = async ({
  city,
  checkIn,
  checkOut,
  budget
}) => {
  const response = await axios.get("https://serpapi.com/search.json", {
    params: {
      engine: "google_hotels",
      q: `hotels in ${city}`,
      check_in_date: checkIn,
      check_out_date: checkOut,
      currency: "INR",
      gl: "in",
      hl: "en",
      api_key: process.env.SERP_API_KEY
    }
  });

  const hotels = response.data.properties || [];

  let maxPrice;
  if (budget === "budget") maxPrice = 2500;
  else if (budget === "premium") maxPrice = 8000;
  else maxPrice = 4000;

  const filteredHotels = hotels
    .filter(h => h.rate_per_night?.extracted_lowest <= maxPrice)
    .slice(0, 3);

  const enrichedHotels = await Promise.all(
    filteredHotels.map(async (h) => {
      let aiReview = "AI review unavailable";

     try {
        // Safely extract snippets only if h.reviews is actually an array
        const safeSnippets = Array.isArray(h.reviews) 
          ? h.reviews.map(r => r.snippet || "").slice(0, 3) 
          : [];

        aiReview = await generateHotelReview({
          name: h.name,
          rating: h.overall_rating,
          price: h.rate_per_night?.extracted_lowest,
          city,
          reviewSnippets: safeSnippets
        });
      } catch (err) {
        console.error(`Gemini review failed for ${h.name}:`, err.message);
      }

      return {
        name: h.name,
        rating: h.overall_rating,
        address: h.neighborhood || h.address,
        pricePerNight: `₹${h.rate_per_night?.extracted_lowest}`,
        totalStayCost: `₹${h.rate_per_night?.extracted_lowest}`,
        reviewsCount: h.reviews_total || 0,
        aiReview, 
        link: h.link
      };
    })
  );

  return enrichedHotels;
};