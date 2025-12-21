const axios = require("axios");

const fetchHotelsFromSerpAPI = async ({
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
      api_key: process.env.SERPAPI_KEY
    }
  });

  const hotels = response.data.properties || [];

  // Budget filtering heuristic
  let maxPrice;
  if (budget === "budget") maxPrice = 2500;
  else if (budget === "premium") maxPrice = 8000;
  else maxPrice = 4000;

  return hotels
    .filter(h => h.rate_per_night?.extracted_lowest <= maxPrice)
    .slice(0, 3)
    .map(h => ({
      name: h.name,
      rating: h.overall_rating,
      address: h.neighborhood || h.address,
      pricePerNight: `₹${h.rate_per_night?.extracted_lowest}`,
      totalStayCost: `₹${h.rate_per_night?.extracted_lowest}`,
      reviews: h.reviews,
      link: h.link
    }));
};

module.exports = { fetchHotelsFromSerpAPI };