import React from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind } from 'lucide-react';

export function WeatherCard({ weather, location }) {
  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'snowy':
      case 'snow':
        return <CloudSnow className="w-8 h-8 text-blue-300" />;
      case 'windy':
        return <Wind className="w-8 h-8 text-gray-400" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  if (!weather || weather.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
          <Cloud className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Weather Forecast</h3>
          <p className="text-sm text-gray-600">{location}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {weather.map((day, index) => (
          <div
            key={index}
            className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-bold text-gray-600 mb-1">{day.day}</p>
            <p className="text-xs text-gray-500 mb-3">{day.date}</p>
            <div className="flex justify-center mb-3">
              {getWeatherIcon(day.condition)}
            </div>
            <p className="text-2xl font-black mb-1">{day.temp}°C</p>
            <p className="text-xs font-semibold text-gray-600 capitalize">{day.condition}</p>
            <p className="text-xs text-gray-500 mt-1">💧 {day.humidity}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}