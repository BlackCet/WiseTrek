// const express = require("express");
// const axios = require("axios");
// const router = express.Router();
// const SerpApi = require('google-search-results-nodejs');

// // Use correct relative path to services/trainservice
// const { getTrainsBetweenStations } = require("../services/trainservice");

// // Initialize SerpApi search object with your key
// const search = new SerpApi.GoogleSearch(process.env.SERP_API_KEY);
// const GEO_API_KEY = process.env.GEOAPIFY_KEY;

// router.post("/route", async (req, res) => {
//   const { from, destination, mode } = req.body;

// router.post("/route", async (req, res) => {
//   const { from, destination, mode, startDate, returnDate } = req.body;

//   // ONLY handle train mode for now
//   if (mode === "train") {
//     try {
//       if (!startDate) {
//         return res.status(400).json({
//           success: false,
//           message: "startDate is required for train mode"
//         });
//       }

//       const startTrains = await getTrainsBetweenStations(from, destination, startDate);

//       let returnTrains = [];
//       if (returnDate) {
//         returnTrains = await getTrainsBetweenStations(destination, from, returnDate);
//       }

//       return res.json({
//         success: true,
//         data: {
//           mode: "train",
//           startDate,
//           returnDate: returnDate || null,
//           startTrains,
//           returnTrains
//         }
//       });
//     } catch (err) {
//       console.error("TRAIN ERROR:", err.message);
//       return res.status(500).json({
//         success: false,
//         message: err.message
//       });
//     }
//   } else {
//     // For now, don't handle drive/bus
//     return res.status(400).json({
//       success: false,
//       message: "Only train mode is currently supported"
//     });
//   }
// });

//   // --- 2. HANDLING DRIVE & BUS MODES (Geoapify) ---
//   try {
//     // 1. Geocode city names to coordinates
//     const geoFrom = await axios.get(
//       `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(from)}&apiKey=${GEO_API_KEY}`
//     );
//     const geoTo = await axios.get(
//       `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(destination)}&apiKey=${GEO_API_KEY}`
//     );

//     if (!geoFrom.data.features.length || !geoTo.data.features.length) {
//       return res.status(400).json({ success: false, message: "Location not found" });
//     }

//     const start = geoFrom.data.features[0].geometry.coordinates; // [lon, lat]
//     const end = geoTo.data.features[0].geometry.coordinates;

//     // 2. Fetch routing data
//     const routeUrl = `https://api.geoapify.com/v1/routing?waypoints=${start[1]},${start[0]}|${end[1]},${end[0]}&mode=${mode}&apiKey=${GEO_API_KEY}`;
//     const routeRes = await axios.get(routeUrl);

//     if (!routeRes.data.features.length) {
//        return res.status(404).json({ success: false, message: "No route found for " + mode });
//     }

//     const feature = routeRes.data.features[0];

//     res.json({
//       success: true,
//       data: {
//         mode,
//         distance: feature.properties.distance, // in meters
//         time: feature.properties.time, // in seconds
//         geometry: feature.geometry, // Needed for Leaflet Polyline
//       }
//     });

//   } catch (err) {
//     console.error("Geoapify Error:", err.message);
//     res.status(500).json({ success: false, message: "Routing failed" });
//   }
// });

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const { getStationCodes } = require("../services/stationService");
// const { getTrainsBetweenStations } = require("../services/trainservice");

// // router.post("/route", async (req, res) => {
// //   const { from, destination, mode, startDate, returnDate } = req.body;

// //   if (mode !== "train") {
// //     return res.status(400).json({ success: false, message: "Only train mode is supported" });
// //   }

// //   const fromCodes = getStationCodes(from);
// //   const toCodes = getStationCodes(destination);

// //   if (!fromCodes.length || !toCodes.length) {
// //     return res.status(400).json({
// //       success: false,
// //       message: "Invalid source or destination station.",
// //     });
// //   }

// //   if (!startDate) {
// //     return res.status(400).json({ success: false, message: "startDate is required" });
// //   }

// //   try {
// //     let startTrains = [];
// //     let returnTrains = [];

// //     for (const f of fromCodes) {
// //       for (const t of toCodes) {
// //         const trains = await getTrainsBetweenStations(f, t, startDate);
// //         startTrains.push(...trains);

// //         if (returnDate) {
// //           const rev = await getTrainsBetweenStations(t, f, returnDate);
// //           returnTrains.push(...rev);
// //         }
// //       }
// //     }

// //     return res.json({
// //       success: true,
// //       data: {
// //         mode: "train",
// //         from: fromCodes,
// //         to: toCodes,
// //         startDate,
// //         returnDate: returnDate || null,
// //         startTrains,
// //         returnTrains,
// //       },
// //     });
// //   } catch (err) {
// //     console.error("TRAIN ERROR:", err);
// //     return res.status(500).json({ success: false, message: "Server error" });
// //   }
// // });


// const MAX_RESULTS = 5;

// router.post("/route", async (req, res) => {
//   const { from, destination, mode, startDate, returnDate } = req.body;

//   if (mode !== "train") {
//     return res.status(400).json({ success: false, message: "Only train mode is supported" });
//   }

//   const fromCodes = getStationCodes(from);
//   const toCodes = getStationCodes(destination);

//   if (!fromCodes.length || !toCodes.length) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid source or destination station.",
//     });
//   }

//   if (!startDate) {
//     return res.status(400).json({ success: false, message: "startDate is required" });
//   }

//   try {
//     let startTrains = [];
//     let returnTrains = [];

//     for (const f of fromCodes) {
//       if (startTrains.length >= MAX_RESULTS && (!returnDate || returnTrains.length >= MAX_RESULTS)) break;

//       for (const t of toCodes) {
//         if (startTrains.length < MAX_RESULTS) {
//           const trains = await getTrainsBetweenStations(f, t, startDate);
//           startTrains.push(...trains);

//           // trim to max
//           if (startTrains.length >= MAX_RESULTS) {
//             startTrains = startTrains.slice(0, MAX_RESULTS);
//           }
//         }

//         if (returnDate && returnTrains.length < MAX_RESULTS) {
//           const rev = await getTrainsBetweenStations(t, f, returnDate);
//           returnTrains.push(...rev);

//           if (returnTrains.length >= MAX_RESULTS) {
//             returnTrains = returnTrains.slice(0, MAX_RESULTS);
//           }
//         }

//         // stop inner loop if both filled
//         if (startTrains.length >= MAX_RESULTS && (!returnDate || returnTrains.length >= MAX_RESULTS)) break;
//       }
//     }

//     return res.json({
//       success: true,
//       data: {
//         mode: "train",
//         from: fromCodes,
//         to: toCodes,
//         startDate,
//         returnDate: returnDate || null,
//         startTrains,
//         returnTrains,
//       },
//     });
//   } catch (err) {
//     console.error("TRAIN ERROR:", err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const axios = require("axios");
const router = express.Router();

const { getStationCodes } = require("../services/stationService");
const { getTrainsBetweenStations } = require("../services/trainservice");

const GEO_API_KEY = process.env.GEOAPIFY_KEY;
const MAX_RESULTS = 5;

const dedupeTrains = (list) => {
  const map = new Map();

  list.forEach(t => {
    if (!t) return;

    const key =
      t.trainNumber?.trim() ||
      `${t.trainName}-${t.departure}-${t.arrival}`;

    if (!map.has(key)) {
      map.set(key, t);
    }
  });

  return Array.from(map.values());
};
/**
 * TRAIN + BUS + DRIVE unified route handler
 */
router.post("/route", async (req, res) => {
  const { from, destination, mode, startDate, returnDate } = req.body;

  // ------------------ TRAIN MODE ------------------
  // if (mode === "train") {
  //   try {
  //     const fromCodes = getStationCodes(from);
  //     const toCodes = getStationCodes(destination);

  //     if (!fromCodes.length || !toCodes.length) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Invalid source or destination station",
  //       });
  //     }

  //     if (!startDate) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "startDate is required for train mode",
  //       });
  //     }

  //     let startTrains = [];
  //     let returnTrains = [];

  //     for (const f of fromCodes) {
  //       if (
  //         startTrains.length >= MAX_RESULTS &&
  //         (!returnDate || returnTrains.length >= MAX_RESULTS)
  //       ) break;

  //       for (const t of toCodes) {
  //         if (startTrains.length < MAX_RESULTS) {
  //           const trains = await getTrainsBetweenStations(f, t, startDate);
  //           startTrains.push(...trains);
  //           startTrains = startTrains.slice(0, MAX_RESULTS);
  //         }

  //         if (returnDate && returnTrains.length < MAX_RESULTS) {
  //           const rev = await getTrainsBetweenStations(t, f, returnDate);
  //           returnTrains.push(...rev);
  //           returnTrains = returnTrains.slice(0, MAX_RESULTS);
  //         }

  //         if (
  //           startTrains.length >= MAX_RESULTS &&
  //           (!returnDate || returnTrains.length >= MAX_RESULTS)
  //         ) break;
  //       }
  //     }

  //     return res.json({
  //       success: true,
  //       data: {
  //         mode: "train",
  //         from: fromCodes,
  //         to: toCodes,
  //         startDate,
  //         returnDate: returnDate || null,
  //         startTrains,
  //         returnTrains,
  //       },
  //     });
  //   } catch (err) {
  //     console.error("TRAIN ERROR:", err);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Train search failed",
  //     });
  //   }
  // }


   if (mode === "train") {
    try {
      const fromCodes = getStationCodes(from);
      const toCodes = getStationCodes(destination);

      if (!fromCodes.length || !toCodes.length) {
        return res.status(400).json({
          success: false,
          message: "Invalid source or destination station",
        });
      }

      if (!startDate) {
        return res.status(400).json({
          success: false,
          message: "startDate is required for train mode",
        });
      }

      let startTrains = [];
      let returnTrains = [];

      for (const f of fromCodes) {
        for (const t of toCodes) {
          if (startTrains.length < MAX_RESULTS) {
            const trains = await getTrainsBetweenStations(f, t, startDate);

            startTrains.push(...trains);
            startTrains = dedupeTrains(startTrains).slice(0, MAX_RESULTS);
          }

          if (returnDate && returnTrains.length < MAX_RESULTS) {
            const rev = await getTrainsBetweenStations(t, f, returnDate);

            returnTrains.push(...rev);
            returnTrains = dedupeTrains(returnTrains).slice(0, MAX_RESULTS);
          }

          if (
            startTrains.length >= MAX_RESULTS &&
            (!returnDate || returnTrains.length >= MAX_RESULTS)
          ) break;
        }
      }

      return res.json({
        success: true,
        data: {
          mode: "train",
          from: fromCodes,
          to: toCodes,
          startDate,
          returnDate: returnDate || null,
          startTrains,
          returnTrains,
        },
      });
    } catch (err) {
      console.error("TRAIN ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Train search failed",
      });
    }
  }


  
  // ------------------ BUS / DRIVE MODE ------------------
  if (mode === "bus" || mode === "drive") {
    try {
      // 1) Geocode cities
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

      // 2) Route request
      const routeUrl =
        `https://api.geoapify.com/v1/routing?waypoints=${start[1]},${start[0]}|${end[1]},${end[0]}` +
        `&mode=${mode}&apiKey=${GEO_API_KEY}`;

      const routeRes = await axios.get(routeUrl);

      if (!routeRes.data.features.length) {
        return res.status(404).json({ success: false, message: `No route found for ${mode}` });
      }

      const feature = routeRes.data.features[0];

      return res.json({
        success: true,
        data: {
          mode,
          distance: feature.properties.distance,
          time: feature.properties.time,
          geometry: feature.geometry,
        },
      });
    } catch (err) {
      console.error("Geoapify Error:", err.message);
      return res.status(500).json({ success: false, message: "Routing failed" });
    }
  }

  // ------------------ UNSUPPORTED MODE ------------------
  return res.status(400).json({
    success: false,
    message: "Supported modes: train, bus, drive",
  });
});

module.exports = router;
