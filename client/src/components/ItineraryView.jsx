import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share2, MessageCircle, CheckCircle } from 'lucide-react';
import { Button, CircularProgress } from '@mui/material';
import { WeatherCard } from './WeatherCard';
import { BudgetBreakdown } from './BudgetBreakdown';
import { RouteMap } from './RouteMap';
import { EventsList } from './EventsList';
import { ChatBot } from './ItineraryBot'; 
import api from '../services/apiService';
import { ShareModal } from './ShareModal';

export function ItineraryView({ planData, onBack }) {
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBotTyping, setIsBotTyping] = useState(false); // Added typing state
  
  const [data, setData] = useState({
    weather: [],
    budget: [],
    route: [],
    events: [],
    budgetTotal: 0
  });
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      text: "👋 Hi! I'm here to help with any questions about your itinerary. Want to make changes or need recommendations?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const destination = planData?.destination || 'Destination';
  const currency = planData?.budget?.match(/[$€£₹]/)?.[0] || '₹'; 

  useEffect(() => {
    const fetchItineraryData = async () => {
      setLoading(true);
      
      let aiPlan = { route: [], budget: { items: [], totalAmount: 0 } };
      let weatherList = [];
      let eventsList = [];

      try {
        const planRes = await api.post('/ai/plan-trip-structured', planData);
        if (planRes.data && planRes.data.data) {
          aiPlan = planRes.data.data;
        }
      } catch (error) {
        console.error("❌ AI Plan API failed:", error.response?.data || error.message);
      }

      try {
        const weatherRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/weather?city=${destination}`);
        if (weatherRes.ok) {
          weatherList = await weatherRes.json();
        }
      } catch (error) {
        console.error("❌ Weather API failed:", error.message);
      }

      try {
        const eventRes = await api.get('/search-events', { params: { destination } });
        eventsList = eventRes.data || [];
      } catch (error) {
        console.error("❌ Events API failed:", error.response?.data || error.message);
      }

      setData({
        weather: mapWeatherData(weatherList), 
        route: aiPlan.route || [], 
        budget: aiPlan.budget?.items || [], 
        budgetTotal: aiPlan.budget?.totalAmount || parseInt(planData.budget.replace(/[^0-9]/g, '')) || 0,
        events: eventsList 
      });

      setLoading(false);
    };

    fetchItineraryData();
  }, [planData, destination]);

  const mapWeatherData = (rawWeather) => {
    if (Array.isArray(rawWeather)) return rawWeather;
    if (rawWeather && rawWeather.temperature) {
      return [
        { day: 'Day 1', date: 'Today', condition: rawWeather.condition, temp: rawWeather.temperature, humidity: rawWeather.humidity },
      ];
    }
    return [];
  };

  // --- UPDATED CHAT LOGIC FOR AI MODIFICATION ---
  const handleChatMessage = async (message) => {
    // Add User Message
    const userMessage = { id: Date.now().toString(), text: message, sender: 'user', timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setIsBotTyping(true);

    try {
      // Call the Modification API
      const modifyRes = await api.post('/ai/modify-trip', {
        currentPlan: { route: data.route, budget: data.budget }, 
        currentData: planData, 
        userInstruction: message 
      });

      if (modifyRes.data && modifyRes.data.data) {
        const updatedAiPlan = modifyRes.data.data;
        
        // Update the Main Itinerary State
        setData(prevData => ({
          ...prevData,
          route: updatedAiPlan.route || prevData.route,
          budget: updatedAiPlan.budget?.items || prevData.budget,
          budgetTotal: updatedAiPlan.budget?.totalAmount || prevData.budgetTotal
        }));

        // Add Bot Success Message
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: "I've updated your itinerary! Check out the changes to your route and budget on the main screen.",
          sender: 'bot',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error("Failed to modify itinerary:", error);
      // Add Bot Error Message
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "Sorry, I ran into an issue modifying the plan. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsBotTyping(false);
    }
  };
  // ---------------------------------------------

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center">
        <CircularProgress size={60} thickness={4} className="text-purple-600 mb-6" />
        <h2 className="text-2xl font-black text-gray-800">Architecting your journey...</h2>
        <p className="text-gray-500 font-semibold mt-2">Connecting to local APIs for {destination}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 pb-12">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="outlined" sx={{ borderRadius: '99px', textTransform: 'none', borderColor: '#e5e7eb', color: '#4b5563', '&:hover': { backgroundColor: '#f9fafb', borderColor: '#d1d5db' } }}>
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
              </Button>
              <div>
                <h1 className="text-2xl font-black bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Your Itinerary
                </h1>
                <p className="text-sm font-bold text-gray-500">{destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowChat(!showChat)} variant="outlined" sx={{ borderRadius: '99px', textTransform: 'none', borderColor: '#e5e7eb', color: '#4b5563' }}>
                <MessageCircle className="w-4 h-4 mr-2" /> Ask Assistant
              </Button>
              <Button onClick={handleShare} variant="outlined" sx={{ borderRadius: '99px', textTransform: 'none', borderColor: '#e5e7eb', color: '#4b5563' }}>
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
              <Button onClick={handlePrint} variant="contained" sx={{ borderRadius: '99px', textTransform: 'none', background: 'linear-gradient(to right, #2563eb, #9333ea)', '&:hover': { background: 'linear-gradient(to right, #1d4ed8, #7e22ce)' } }}>
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div id="printable-itinerary" className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-linear-to-r from-green-500 to-emerald-500 rounded-2xl p-6 mb-8 text-white shadow-xl print:hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-black mb-1">Itinerary Ready! 🎉</h2>
              <p className="text-white/90 font-medium">
                Your complete travel plan is ready with weather forecasts, budget breakdown, optimized routes, and local events!
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="lg:col-span-2">
            <WeatherCard weather={data.weather} location={destination} />
          </div>

          <div>
            <RouteMap stops={data.route} startLocation={planData.accommodation || "Your Hotel"} />
          </div>

          <div>
            <BudgetBreakdown budget={data.budget} total={data.budgetTotal} currency={currency} />
          </div>

          <div className="lg:col-span-2">
            <EventsList events={data.events} />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold mb-6">Day-by-Day Schedule</h3>
          <div className="space-y-6">
            {data.route && data.route.length > 0 ? data.route.map((stop, index) => (
              <div key={index} className="flex gap-4" style={{ pageBreakInside: 'avoid' }}>
                <div className="w-16 h-16 rounded-xl bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                  <div className="text-center">
                    <div className="text-xs font-bold uppercase tracking-widest">Day</div>
                    <div className="text-xl font-black">{stop.day}</div>
                  </div>
                </div>
                <div className="flex-1 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100/50">
                  <h4 className="text-lg font-bold mb-2 text-gray-900">{stop.name}</h4>
                  <div className="grid md:grid-cols-3 gap-3 text-sm font-medium text-gray-600">
                    <div><span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider block mb-1">Duration</span> {stop.duration}</div>
                    <div><span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider block mb-1">Distance</span> {stop.distance}</div>
                    <div><span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider block mb-1">Weather</span> {data.weather[index]?.condition || 'Sunny'}</div>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 italic">No daily schedule generated.</p>
            )}
          </div>
        </div>
      </div>

      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] z-50 print:hidden">
          <ChatBot 
            messages={chatMessages} 
            onSendMessage={handleChatMessage} 
            placeholder="Ask about your itinerary..." 
            botName="WiseTrek Assistant" 
            onClose={() => setShowChat(false)}
            isTyping={isBotTyping} // Passed the typing state
          />
        </div>
      )}

      {/* Render the Share Modal */}
      <ShareModal 
        open={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        destination={destination}
        planData={planData}
      />
    </div>
  );
}