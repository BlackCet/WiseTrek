import React from "react";
import { Button } from "@mui/material";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { classifyEvent, getCategoryStyles } from "../utils/eventUtils";

export const EventListItem = ({ event }) => {
  const category = classifyEvent(event);
  const { color, emoji } = getCategoryStyles(category);

  // ✅ NEW EXTRACTION LOGIC
  const displayDate = typeof event.date === 'string' 
    ? event.date 
    : (event.date?.when || event.date?.start_date || "Date TBD");
    
  const displayLocation = event.address && Array.isArray(event.address) 
    ? event.address[0] 
    : (event.venue?.name || "Local Venue");

  const ticketLink = event.link || event.ticket_info?.[0]?.link || `https://www.google.com/search?q=${encodeURIComponent(event.title + ' tickets')}`;

  return (
    <div className="group relative bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-xl transition-all duration-300 mb-4 overflow-hidden shadow-sm">
      <div className="flex gap-4 relative z-10">
        <div className={`w-16 h-16 rounded-2xl bg-linear-to-r ${color} flex items-center justify-center text-3xl shrink-0 shadow-md transform group-hover:scale-110 transition-transform`}>
          {emoji}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{event.title}</h4>
              <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold bg-linear-to-r ${color} text-white uppercase tracking-wider mt-1`}>{category}</span>
            </div>
            {/* Updated href */}
            <Button href={ticketLink} target="_blank" variant="contained" className={`rounded-full px-6 bg-linear-to-r ${color} text-white font-bold text-xs shadow-lg`}>Get Tickets</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-500">
            {/* Updated variable rendering */}
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" /><span>{displayDate}</span></div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-500" /><span>{displayLocation}</span></div>
            <div className="flex items-center gap-2 text-green-600 font-semibold"><Ticket className="w-4 h-4" /><span>Search Tickets</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};