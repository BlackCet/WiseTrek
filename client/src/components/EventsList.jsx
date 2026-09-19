import React from 'react';
import { Calendar, MapPin, Clock, Ticket } from 'lucide-react';
import { classifyEvent, getCategoryStyles } from '../utils/eventUtils';

export function EventsList({ events }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header section remains exactly the same... */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-linear-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-md">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Local Events</h3>
          <p className="text-sm font-semibold text-gray-500">Happening during your visit</p>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => {
          const category = classifyEvent(event);
          const { color, emoji } = getCategoryStyles(category);

          // ✅ NEW EXTRACTION LOGIC: Handle both old and new SerpApi schemas
          const displayDate = typeof event.date === 'string' 
            ? event.date 
            : (event.date?.when || event.date?.start_date || "Date TBD");
            
          const displayLocation = event.address && Array.isArray(event.address) 
            ? event.address[0] 
            : (event.venue?.name || "Local Venue");
            
          const displayTime = typeof event.time === 'string' ? event.time : null;

          // Provide a fallback search query if Google stripped the direct ticket link
          const ticketLink = event.link || event.ticket_info?.[0]?.link || `https://www.google.com/search?q=${encodeURIComponent(event.title + ' tickets')}`;

          return (
            <div
              key={index}
              className="group relative bg-linear-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex gap-4 relative z-10">
                <div className={`w-14 h-14 rounded-xl bg-linear-to-r ${color} flex items-center justify-center text-2xl flex-shrink-0 shadow-md transform group-hover:scale-110 transition-transform`}>
                  {emoji}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h4>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider bg-linear-to-r ${color} text-white uppercase`}>
                        {category}
                      </span>
                    </div>
                    {/* Render button reliably using the new ticketLink logic */}
                    <a href={ticketLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full border border-green-100 hover:bg-green-100 transition-colors">
                      <Ticket className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold text-green-700">Tickets</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="truncate">{displayDate}</span>
                    </div>
                    {displayTime && (
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                        <span className="truncate">{displayTime}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <MapPin className="w-4 h-4 text-purple-500 shrink-0" />
                      <span className="truncate">{displayLocation}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-r from-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          );
        })}
      </div>

      {/* Summary Section remains exactly the same... */}
    </div>
  );
}