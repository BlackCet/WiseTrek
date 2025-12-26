// import { searchTrainBetweenStations } from "irctc-connect";

// const run = async () => {
//   const res = await searchTrainBetweenStations("NDLS", "BCT");
//   console.log(JSON.stringify(res, null, 2));
// };

// run();


const { searchTrainBetweenStations } = require("irctc-connect");

(async () => {
  const a = await searchTrainBetweenStations("NZM", "BDTS");
  const b = await searchTrainBetweenStations("BDTS", "NZM");

  console.log("NZM → BDTS:", a);
  console.log("BDTS → NZM:", b);
})();
