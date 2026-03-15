import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export function RouteMap({ stops, startLocation }) {
  if (!stops || stops.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <Navigation className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Your Route</h3>
          <p className="text-sm text-gray-600">Optimized travel path</p>
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-linear-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="w-0.5 h-16 bg-gradient-to-b from-green-500 to-blue-500"></div>
          </div>
          <div className="flex-1 pt-2">
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <p className="text-sm font-bold text-gray-600 mb-1">Starting Point</p>
              <p className="text-lg font-bold">{startLocation}</p>
            </div>
          </div>
        </div>

        {stops.map((stop, index) => (
          <div key={index} className="flex gap-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg font-bold">
                <span>{stop.day}</span>
              </div>
              {index < stops.length - 1 && (
                <div className="w-0.5 h-16 bg-gradient-to-b from-blue-500 to-purple-500"></div>
              )}
            </div>
            <div className="flex-1 pt-2">
              <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-1">Day {stop.day}</p>
                    <p className="text-lg font-bold mb-1">{stop.name}</p>
                  </div>
                  {stop.distance && (
                    <span className="text-xs font-bold bg-white px-3 py-1 rounded-full text-gray-600">
                      {stop.distance}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{stop.duration}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl overflow-hidden bg-linear-to-r from-blue-100 via-purple-100 to-pink-100 h-64 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10"></div>
        <div className="relative text-center">
          <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-sm">
            <MapPin className="w-10 h-10 text-purple-600" />
          </div>
          <p className="font-bold text-gray-700">Interactive map visualization</p>
          <p className="text-sm text-gray-600 mt-1">View detailed route and points of interest</p>
        </div>
      </div>
    </div>
  );
}