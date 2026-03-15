import { useEffect, useState } from "react";
import HotelCard from "./HotelCard";
import { Building } from "lucide-react";
import axios from "axios";

const HotelList = ({ destination, startDate, endDate }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!destination || !startDate || !endDate) return;

    const fetchHotels = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5001/api/hotels", {
          params: {
            city: destination,
            checkIn: startDate,
            checkOut: endDate,
            budget: "mid"
          }
        });
        console.log("HOTEL API RESPONSE:", res.data);
        setHotels(res.data.hotels || []);
      } catch (err) {
        console.error("Hotel fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destination, startDate, endDate]);

  if (!destination) return null;

  return (
    <div className="mt-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
          <Building className="text-white w-6 h-6" />
        </div>
        <h2 className="text-3xl font-black text-gray-900">
          Stay Recommendations
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">
          Finding best stays for you...
        </div>
      ) : hotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotels.map((hotel, idx) => (
            <HotelCard key={idx} hotel={hotel} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-gray-400">
          No hotels found for selected dates.
        </div>
      )}
    </div>
  );
};

export default HotelList;
