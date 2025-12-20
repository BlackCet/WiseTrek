const { getWeatherByCity, getWeatherRecommendation } = require("../services/weatherService");

const getWeather = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const weather = await getWeatherByCity(city);
    const recommendation = getWeatherRecommendation(weather);
    res.status(200).json({...weather, recommendation });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch weather data",
      error: error.message,
    });
  }
};

module.exports = { getWeather };