const { fetchHotelsFromSerpAPI } = require("../services/hotelService");

const getHotels = async (req, res) => {
  try {
    const {
      city,
      checkIn,
      checkOut,
      budget = "mid"
    } = req.query;

    if (!city || !checkIn || !checkOut) {
      return res.status(400).json({
        error: "city, checkIn and checkOut are required"
      });
    }

    const hotels = await fetchHotelsFromSerpAPI({
      city,
      checkIn,
      checkOut,
      budget
    });

    res.json({
      destination: city,
      hotels
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Hotel fetch failed" });
  }
};

module.exports = { getHotels };