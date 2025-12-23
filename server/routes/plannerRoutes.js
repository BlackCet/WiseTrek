// const express = require("express");
// const axios = require("axios");
// const router = express.Router();
// require("dotenv").config();
// console.log("GEOAPIFY_KEY =", process.env.GEOAPIFY_KEY);


// const API_KEY = process.env.GEOAPIFY_KEY; // Add this to your .env file

// router.post("/route", async (req, res) => {
//   const { from, destination, mode } = req.body;

//   try {
//     // 1. Geocode
//     const geoFrom = await axios.get(
//       `https://api.geoapify.com/v1/geocode/search?text=${from}&apiKey=${API_KEY}`
//     );
//     const geoTo = await axios.get(
//       `https://api.geoapify.com/v1/geocode/search?text=${destination}&apiKey=${API_KEY}`
//     );

//     if (!geoFrom.data.features.length || !geoTo.data.features.length) {
//       return res.status(400).json({ success: false, message: "Location not found" });
//     }

//     const start = geoFrom.data.features[0].geometry.coordinates; // [lon, lat]
//     const end = geoTo.data.features[0].geometry.coordinates;

//     // 2. Routing
//     const routeUrl = `https://api.geoapify.com/v1/routing?waypoints=${start[1]},${start[0]}|${end[1]},${end[0]}&mode=${mode}&apiKey=${API_KEY}`;

//     const routeRes = await axios.get(routeUrl);

//     const feature = routeRes.data.features[0];

//     res.json({
//       success: true,
//       data: {
//         mode,
//         distance: feature.properties.distance,
//         time: feature.properties.time,
//         geometry: feature.geometry.coordinates, // 🔥 THIS IS REQUIRED
//       }
//     });

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ success: false, message: "Routing failed" });
//   }
// });


// module.exports = router;

const express = require("express");
const axios = require("axios");
const router = express.Router();
const SerpApi = require('google-search-results-nodejs');

// Initialize SerpApi search object with your key
const search = new SerpApi.GoogleSearch(process.env.SERP_API_KEY);
const GEO_API_KEY = process.env.GEOAPIFY_KEY;

router.post("/route", async (req, res) => {
  const { from, destination, mode } = req.body;

  // --- 1. HANDLING TRAIN MODE (SerpApi) ---
  if (mode === "train") {
    
    const query = `IRCTC train distance and ticket price from ${from} to ${destination} in rupees`;
    const params = {
      q: query,
      location: "India",
      hl: "hi", // Using Hindi/English mix improves local results
      gl: "in",
      google_domain: "google.co.in"
    };

    try {
      search.json(params, (data) => {
        // Extracting data from the specific SerpApi JSON fields you shared
        const organicSnippet = data.organic_results?.[0]?.snippet || "";
        const fareList = data.related_questions?.find(q => q.question.includes("price"))?.text_blocks?.[2]?.list || [];
        
        res.json({
          success: true,
          data: {
            mode: "train",
            // We pull distance and time from the organic snippets or AI overview
            distanceText: organicSnippet.match(/(\d+)\s?km/)?.[0] || "See Details",
            timeText: data.related_questions?.[0]?.text_blocks?.[0]?.snippet_highlighted_words?.[0] || "Check Schedule",
            fares: fareList.map(item => item.snippet), // Array of class-wise prices
            rawSnippet: organicSnippet
          }
        });
      });
      return; // Stop execution here for train mode
    } catch (err) {
      return res.status(500).json({ success: false, message: "Train search failed" });
    }
  }

  // --- 2. HANDLING DRIVE & BUS MODES (Geoapify) ---
  try {
    // 1. Geocode city names to coordinates
    const geoFrom = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(from)}&apiKey=${GEO_API_KEY}`
    );
    const geoTo = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(destination)}&apiKey=${GEO_API_KEY}`
    );

    if (!geoFrom.data.features.length || !geoTo.data.features.length) {
      return res.status(400).json({ success: false, message: "Location not found" });
    }

    const start = geoFrom.data.features[0].geometry.coordinates; // [lon, lat]
    const end = geoTo.data.features[0].geometry.coordinates;

    // 2. Fetch routing data
    const routeUrl = `https://api.geoapify.com/v1/routing?waypoints=${start[1]},${start[0]}|${end[1]},${end[0]}&mode=${mode}&apiKey=${GEO_API_KEY}`;
    const routeRes = await axios.get(routeUrl);

    if (!routeRes.data.features.length) {
       return res.status(404).json({ success: false, message: "No route found for " + mode });
    }

    const feature = routeRes.data.features[0];

    res.json({
      success: true,
      data: {
        mode,
        distance: feature.properties.distance, // in meters
        time: feature.properties.time, // in seconds
        geometry: feature.geometry, // Needed for Leaflet Polyline
      }
    });

  } catch (err) {
    console.error("Geoapify Error:", err.message);
    res.status(500).json({ success: false, message: "Routing failed" });
  }
});

module.exports = router;