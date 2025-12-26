// // // // // const express = require("express");
// // // // // const router = express.Router();
// // // // // const { getStationCode } = require("../services/stationService");
// // // // // const { getTrainsBetweenStations } = require("../services/trainservice");

// // // // // router.post("/route", async (req, res) => {
// // // // //   try {
// // // // //     const { from, destination, mode, startDate, returnDate } = req.body;

// // // // //     if (mode !== "train") {
// // // // //       return res.status(400).json({ success: false, message: "Only train mode supported" });
// // // // //     }

// // // // //     if (!startDate) {
// // // // //       return res.status(400).json({ success: false, message: "startDate is required" });
// // // // //     }

// // // // //     const fromCode = await getStationCode(from);
// // // // //     const toCode = await getStationCode(destination);

// // // // //     if (!fromCode || !toCode) {
// // // // //       return res.status(400).json({ success: false, message: "Invalid source or destination station" });
// // // // //     }

// // // // //     const startTrains = await getTrainsBetweenStations(fromCode, toCode, startDate);
// // // // //     const returnTrains = returnDate ? await getTrainsBetweenStations(toCode, fromCode, returnDate) : [];

// // // // //     return res.json({
// // // // //       success: true,
// // // // //       data: { mode: "train", from: fromCode, to: toCode, startDate, returnDate: returnDate || null, startTrains, returnTrains },
// // // // //     });
// // // // //   } catch (err) {
// // // // //     console.error("SERVER ERROR:", err);
// // // // //     return res.status(500).json({ success: false, message: "Something went wrong on the server!" });
// // // // //   }
// // // // // });

// // // // // module.exports = router;


// // // // // services/stationService.js
// // // // const stations = require("../data/stations.json");

// // // // /**
// // // //  * Converts a city name, station name, or station code to the station code.
// // // //  * @param {string} input - City name, station name, or station code
// // // //  * @returns {string|null} - Station code or null if not found
// // // //  */
// // // // const getStationCode = (input) => {
// // // //   if (!input) return null;
// // // //   const query = input.trim().toLowerCase();

// // // //   const station = stations.find(
// // // //     (s) =>
// // // //       s.stnCode.toLowerCase() === query ||
// // // //       s.stnName.toLowerCase() === query ||
// // // //       s.stnCity.toLowerCase() === query
// // // //   );

// // // //   return station ? station.stnCode : null;
// // // // };

// // // // module.exports = { getStationCode };


// // // const path = require("path");
// // // const fs = require("fs");

// // // // Load the JSON file
// // // const stationsPath = path.join(__dirname, "../data/stations.json");

// // // // Parse it safely
// // // let stations = [];
// // // try {
// // //   const rawData = fs.readFileSync(stationsPath, "utf-8");
// // //   const parsed = JSON.parse(rawData);

// // //   // Extract the array from the "stations" key
// // //   if (parsed.stations && Array.isArray(parsed.stations)) {
// // //     stations = parsed.stations;
// // //   } else {
// // //     console.error("stations.json format is invalid");
// // //   }
// // // } catch (err) {
// // //   console.error("Error reading stations.json:", err);
// // // }

// // // // Function to get station code from name or city
// // // const getStationCode = (nameOrCity) => {
// // //   if (!nameOrCity || typeof nameOrCity !== "string") return null;

// // //   const stn = stations.find(
// // //     (s) =>
// // //       s.stnName.toLowerCase() === nameOrCity.toLowerCase() ||
// // //       s.stnCity.toLowerCase() === nameOrCity.toLowerCase()
// // //   );

// // //   return stn ? stn.stnCode : null;
// // // };

// // // module.exports = { getStationCode };


// // const stationsData = require("../data/stations.json"); // JSON file with "stations" array
// // const Fuse = require("fuse.js"); // for fuzzy search fallback

// // const stations = stationsData.stations;

// // // Initialize Fuse.js for fuzzy searching station names
// // const fuse = new Fuse(stations, {
// //   keys: ["stnName", "stnCity"],
// //   threshold: 0.4, // adjust for sensitivity
// // });

// // /**
// //  * Get IRCTC-compatible station code from name or city.
// //  * If exact match not found, uses fuzzy search fallback.
// //  * @param {string} nameOrCity
// //  * @returns {string|null} station code
// //  */
// // function getStationCode(nameOrCity) {
// //   if (!nameOrCity) return null;

// //   // 1. Exact match (case-insensitive)
// //   const exactMatch = stations.find(
// //     (s) =>
// //       s.stnName.toLowerCase() === nameOrCity.toLowerCase() ||
// //       s.stnCity.toLowerCase() === nameOrCity.toLowerCase()
// //   );
// //   if (exactMatch) return exactMatch.stnCode;

// //   // 2. Fuzzy search fallback
// //   const fuzzyResult = fuse.search(nameOrCity);
// //   if (fuzzyResult.length > 0) {
// //     return fuzzyResult[0].item.stnCode;
// //   }

// //   // 3. If nothing found, return null or a default station
// //   return null;
// // }

// // module.exports = { getStationCode };

// const stations = require("../data/stations.json").stations;

// /**
//  * Get all station codes for a given input
//  * If exact code is passed, returns that as array
//  * If city/station name is passed, return all matching codes
//  */
// function getStationCodes(input) {
//   if (!input) return [];

//   // If input is already a 3-4 letter code
//   if (input.length <= 4) return [input.toUpperCase()];

//   // Search all stations that match city or station name
//   const matchingStations = stations.filter(station =>
//     station.stnCity.toLowerCase().includes(input.toLowerCase()) ||
//     station.stnName.toLowerCase().includes(input.toLowerCase())
//   );

//   // Return all codes
//   return matchingStations.map(s => s.stnCode.toUpperCase());
// }

// module.exports = { getStationCodes };


const stations = require("../data/stations.json").stations;

function getStationCodes(input) {
  if (!input) return [];

  // If user already entered a code
  if (input.length <= 4) return [input.toUpperCase()];

  const matches = stations.filter(st =>
    st.stnCity.toLowerCase().includes(input.toLowerCase()) ||
    st.stnName.toLowerCase().includes(input.toLowerCase())
  );

  return matches.map(st => st.stnCode.toUpperCase());
}

module.exports = { getStationCodes };
