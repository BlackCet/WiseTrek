// // // // // const getTrainsBetweenStations = async (from, to) => {
// // // // //   const irctc = await import("irctc-connect");
// // // // //   const { searchTrainBetweenStations } = irctc;

// // // // //   const result = await searchTrainBetweenStations(from, to);

// // // // //   if (!result || !result.success) {
// // // // //     throw new Error("IRCTC API failed");
// // // // //   }

// // // // //   return result.data;
// // // // // };

// // // // // module.exports = { getTrainsBetweenStations };


// // // // // services/trainservice.js
// // // // const getTrainsBetweenStations = async (from, to, journeyDate) => {
// // // //   const irctc = await import("irctc-connect");
// // // //   const { searchTrainBetweenStations, getAvailability } = irctc;

// // // //   // 1. Get all trains between stations
// // // //   const result = await searchTrainBetweenStations(from, to);
// // // //   if (!result || !result.success) {
// // // //     throw new Error("IRCTC API failed");
// // // //   }

// // // //   const trains = result.data.trains;

// // // //   // 2. Filter trains by availability on the journey date
// // // //   const filteredTrains = [];
// // // //   for (const train of trains) {
// // // //     const availability = await getAvailability(
// // // //       train.trainNumber,
// // // //       from,
// // // //       to,
// // // //       journeyDate,
// // // //       "3A", // default class, you can make it dynamic later
// // // //       "GN"  // general quota
// // // //     );

// // // //     if (availability.success) {
// // // //       filteredTrains.push({
// // // //         ...train,
// // // //         availability: availability.data, // contains fare & seat info
// // // //       });
// // // //     }
// // // //   }

// // // //   return filteredTrains;
// // // // };

// // // // module.exports = { getTrainsBetweenStations };


// // // // services/trainservice.js
// // // const { searchTrainBetweenStations, getAvailability } = require("irctc-connect");

// // // /**
// // //  * Get trains between stations with availability on a specific date
// // //  * @param {string} from - From station code
// // //  * @param {string} to - To station code
// // //  * @param {string} journeyDate - Date in DD-MM-YYYY format
// // //  * @returns {Array} - Array of trains with availability info
// // //  */
// // // const getTrainsBetweenStations = async (from, to, journeyDate) => {
// // //   try {
// // //     // 1. Get all trains between stations
// // //     const result = await searchTrainBetweenStations(from, to);

// // //     if (!result.success || !Array.isArray(result.data.trains)) {
// // //       return [];
// // //     }

// // //     const trains = result.data.trains;

// // //     // 2. Fetch availability for each train
// // //     const filteredTrains = [];
// // //     for (const train of trains) {
// // //       try {
// // //         const availability = await getAvailability(
// // //           train.trainNumber,
// // //           from,
// // //           to,
// // //           journeyDate,
// // //           "3A", // default class
// // //           "GN"  // general quota
// // //         );

// // //         if (availability.success) {
// // //           filteredTrains.push({
// // //             ...train,
// // //             availability: availability.data, // contains fare & seat info
// // //           });
// // //         }
// // //       } catch (err) {
// // //         console.warn(`Availability fetch failed for train ${train.trainNumber}: ${err.message}`);
// // //       }
// // //     }

// // //     return filteredTrains;

// // //   } catch (err) {
// // //     console.error("Error in getTrainsBetweenStations:", err.message);
// // //     return [];
// // //   }
// // // };

// // // module.exports = { getTrainsBetweenStations };


// // const { searchTrainBetweenStations, getAvailability } = require("irctc-connect");

// // const getTrainsBetweenStations = async (from, to, journeyDate) => {
// //   const result = await searchTrainBetweenStations(from, to);

// //   if (!result.success || !Array.isArray(result.data.trains)) {
// //     return [];
// //   }

// //   const trains = result.data.trains;
// //   const finalTrains = [];

// //   for (const train of trains) {
// //     let availabilityData = null;

// //     try {
// //       const availability = await getAvailability(
// //         train.trainNumber,
// //         from,
// //         to,
// //         journeyDate,
// //         "3A",
// //         "GN"
// //       );

// //       if (availability.success) {
// //         availabilityData = availability.data;
// //       }
// //     } catch (err) {
// //       // ignore availability errors
// //     }

// //     finalTrains.push({
// //       ...train,
// //       availability: availabilityData, // null if not available
// //     });
// //   }

// //   return finalTrains;
// // };

// // module.exports = { getTrainsBetweenStations };



// services/trainservice.js
// const { searchTrainBetweenStations, getAvailability } = require("irctc-connect");

// const getTrainsBetweenStations = async (from, to, journeyDate) => {
//   const result = await searchTrainBetweenStations(from, to);

//   // ✅ correct validation
//   if (!result || !result.success || !Array.isArray(result.data)) {
//     return [];
//   }

//   const trains = result.data;
//   const finalTrains = [];

//   for (const train of trains) {
//     let availabilityData = null;

//     // availability is OPTIONAL
//     if (journeyDate) {
//       try {
//         const availability = await getAvailability(
//           train.train_no, // ⚠️ correct key
//           from,
//           to,
//           journeyDate,
//           "3A",
//           "GN"
//         );

//         if (availability?.success) {
//           availabilityData = availability.data;
//         }
//       } catch {
//         availabilityData = null;
//       }
//     }

//     // ALWAYS push train
//     finalTrains.push({
//       trainNumber: train.train_no,
//       trainName: train.train_name,
//       departure: train.from_time,
//       arrival: train.to_time,
//       duration: train.travel_time,
//       runningDays: train.running_days,
//       distance: train.distance,
//       availability: availabilityData
//     });
//   }

//   return finalTrains;
// };

// module.exports = { getTrainsBetweenStations };



const { searchTrainBetweenStations, getAvailability } = require("irctc-connect");

/**
 * Convert date → running_days index
 * IRCTC format: Sun(0) → Sat(6)
 */
const getDayIndex = (dateStr) => {
  const [dd, mm, yyyy] = dateStr.split("-");
  return new Date(`${yyyy}-${mm}-${dd}`).getDay();
};

const getTrainsBetweenStations = async (from, to, journeyDate) => {
  const result = await searchTrainBetweenStations(from, to);
  console.log("IRCTC Raw Result:", result);

  if (!result || !result.success || !Array.isArray(result.data)) {
    return [];
  }

  const trains = result.data;
  const dayIndex = journeyDate ? getDayIndex(journeyDate) : null;

  const finalTrains = [];

  for (const train of trains) {
    // ✅ FILTER BY RUNNING DAY
    if (dayIndex !== null && train.running_days?.[dayIndex] !== "1") {
      continue;
    }

    let availabilityData = null;

    // OPTIONAL availability
    if (journeyDate) {
      try {
        const availability = await getAvailability(
          train.train_no,
          from,
          to,
          journeyDate,
          "3A",
          "GN"
        );

        if (availability?.success) {
          availabilityData = availability.data;
        }
      } catch {
        availabilityData = null;
      }
    }

    finalTrains.push({
      trainNumber: train.train_no,
      trainName: train.train_name,
      from: train.from_stn_code,
      to: train.to_stn_code,
      departure: train.from_time,
      arrival: train.to_time,
      duration: train.travel_time,
      runningDays: train.running_days,
      distance: train.distance,
      availability: availabilityData // can be null
    });
  }

  return finalTrains;
};

module.exports = { getTrainsBetweenStations };
