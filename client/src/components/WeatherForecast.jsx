import React from "react";
import { Paper, Typography } from "@mui/material";
import { CloudSun, CloudRain, CloudSnow, Sun, Wind, Cloud, Sparkles } from "lucide-react";

export const WeatherForecast = ({ weather, location }) => {
  const getWeatherIcon = (condition) => {
    const cond = condition?.toLowerCase() || "";
    if (cond.includes("sunny") || cond.includes("clear")) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (cond.includes("rain")) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (cond.includes("snow")) return <CloudSnow className="w-8 h-8 text-blue-300" />;
    if (cond.includes("wind")) return <Wind className="w-8 h-8 text-gray-400" />;
    return <Cloud className="w-8 h-8 text-gray-500" />;
  };

  return (
    <Paper elevation={0} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg text-white">
          <CloudSun size={28} />
        </div>
        <div>
          <Typography variant="h5" className="font-black text-gray-900 leading-tight">Travel Forecast</Typography>
          <p className="text-sm text-gray-500">Real-time conditions for {location}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 text-center border border-blue-200">
          <div className="flex justify-center mb-4">{getWeatherIcon(weather.condition)}</div>
          <Typography variant="h3" className="font-black text-blue-900">{weather.temperature}°C</Typography>
          <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-1">{weather.condition}</p>
        </div>
        <div className="bg-gray-50 rounded-3xl p-6 flex flex-col justify-center space-y-4 border border-gray-200">
          <div className="flex justify-between font-medium">
            <span className="text-gray-500">Feels Like</span>
            <span className="text-gray-900">{weather.feelsLike}°C</span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-gray-500">Humidity</span>
            <span className="text-gray-900">{weather.humidity}%</span>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-blue-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Sparkles className="text-blue-500" />
          </div>
          <p className="text-sm text-gray-700 italic">"💡 {weather.recommendation || "Perfect time to start your adventure!"}"</p>
        </div>
      </div>
    </Paper>
  );
};