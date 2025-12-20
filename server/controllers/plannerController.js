const { getWeatherByCity, getWeatherRecommendation } = require("../services/weatherService");
// Later:
// const { getRoutes } = require("../services/routeService");
// const { getEvents } = require("../services/eventService");

const getTravelPlan = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const weather = await getWeatherByCity(city);
    const recommendation = getWeatherRecommendation(weather);

    // TEMP placeholders (until teammates finish)
    const routes = "Route module in progress 🚧";
    const events = "Event module in progress 🚧";

    res.status(200).json({
      destination: city,
      weather,
      recommendation,
      routes,
      events,
    });
  } catch (error) {
    res.status(500).json({ message: "Planner failed", error: error.message });
  }
};

module.exports = { getTravelPlan };