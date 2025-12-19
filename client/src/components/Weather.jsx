import { useState } from "react";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const response = await fetch(
        `http://localhost:4000/api/weather?city=${city}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch");
      }

      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px",
  maxWidth: "400px",
  margin: "50px auto",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <h2>🌦 Weather Information</h2>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "8px", width: "100%" }}
      />

      <button
        onClick={fetchWeather}
        disabled={!city || loading}
        style={{ marginTop: "10px", padding: "8px", width: "100%", cursor:city?"pointer":"not-allowed" }}
      >
        Get Weather
      </button>

      {error && <p style={{ color: "crimson" }}>⚠ {error}</p>}

      {loading && <p>Loading weather data...</p>}


      {weather && (
        <div style={{ marginTop: "15px" }}>
          <p><b>City:</b> {weather.city}</p>
          <p><b>Temperature:</b> {weather.temperature}°C</p>
          <p><b>Feels Like:</b> {weather.feelsLike}°C</p>
          <p><b>Humidity:</b> {weather.humidity}%</p>
          <p><b>Condition:</b> {weather.condition}</p>
          {weather.recommendation && (
  <p style={{ marginTop: "10px", fontWeight: "bold" }}>
    💡 {weather.recommendation}
  </p>
)}

        </div>
      )}
    </div>
  );
};

export default Weather;
