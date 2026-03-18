import axios from "axios";

export const getWeatherByCity = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const response = await axios.get(url);

  return {
    city: response.data.name,
    temperature: response.data.main.temp,
    feelsLike: response.data.main.feels_like,
    humidity: response.data.main.humidity,
    condition: response.data.weather[0].description,
  };
};

export const getWeatherRecommendation = (weather) => {
  const { temperature, condition } = weather;

  if (temperature >= 38) {
    return "Very hot weather 🌞. Avoid outdoor travel during noon. Prefer mornings or evenings.";
  }

  if (temperature >= 30 && temperature < 38) {
    return "Warm weather 😊. Good for sightseeing with hydration breaks.";
  }

  if (temperature >= 20 && temperature < 30) {
    return "Pleasant weather 🌤️. Ideal for outdoor activities and travel.";
  }

  if (temperature < 20) {
    return "Cool weather ❄️. Carry light warm clothes, good for walking tours.";
  }

  if (condition.includes("rain")) {
    return "Rainy conditions 🌧️. Consider indoor activities or carry rain protection.";
  }

  return "Weather conditions are moderate. Plan accordingly.";
};

