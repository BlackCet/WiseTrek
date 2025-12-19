//role
//getWeather(destination)->{temperature,condition,humidity}

const axios = require("axios");

const getWeatherByCity = async (city) => {
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

module.exports = { getWeatherByCity };



/*

Calling:

getWeather("Goa")


Returns:

{
  "city": "Goa",
  "temperature": 30,
  "feelsLike": 34,
  "humidity": 65,
  "condition": "Clear",
  "description": "clear sky",
  "icon": "01d"
}
*/