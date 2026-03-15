import { MapPin, Star, ExternalLink, Sparkles } from "lucide-react";

const HotelCard = ({ hotel }) => {
  return (
    <div className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      
      {/* Gradient hover layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-black text-gray-900">{hotel.name}</h3>
          <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full text-yellow-700 font-bold text-sm">
            <Star size={14} fill="currentColor" />
            {hotel.rating || "N/A"}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <MapPin size={14} />
          <span>{hotel.address || "Central Location"}</span>
        </div>

       {/* AI Review */}
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-1 text-purple-600 font-bold text-sm">
            <Sparkles size={16} />
            AI Review Summary
          </div>
          <p className="text-gray-600 text-sm italic">
            {/* Inject the actual AI review here, with a fallback just in case */}
            “{hotel.aiReview || "Guests appreciate the clean rooms and convenient location."}”
          </p>
        </div>

        {/* Pricing */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Per Night</p>
            <p className="text-2xl font-black text-gray-900">
              {hotel.pricePerNight}
            </p>
          </div>

          <a
            href={hotel.link}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg hover:scale-105 transition-transform"
          >
            View Hotel
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
