import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Paper,
  Box,
  TextField,
  Grid,
  CircularProgress,
  Container,
  MenuItem,
} from "@mui/material";
import {
  MapPin,
  Sparkles,
  User,
  X,
  CloudSun,
  Calendar,
  Ticket,
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Wind,
  Route,
  Wallet,
  CalendarRange,
  RotateCcw,
  LogOut,
} from "lucide-react";
import apiService from "../services/apiService";
import { AuthBot } from "./AuthBot"; // Ensure path is correct
import "../index.css";

// --- LOGIC HELPERS ---

const classifyEvent = (event) => {
  const text = `${event.title} ${event.category || ""}`.toLowerCase();
  if (text.includes("music") || text.includes("concert") || text.includes("dj") || text.includes("live")) return "concert";
  if (text.includes("match") || text.includes("cricket") || text.includes("football") || text.includes("sports") || text.includes("cup") || text.includes("race")) return "sports";
  if (text.includes("food") || text.includes("feast") || text.includes("dining") || text.includes("culinary") || text.includes("drink") || text.includes("restaurant")) return "food";
  if (text.includes("fest") || text.includes("carnival") || text.includes("fair") || text.includes("gala") || text.includes("celebration")) return "festival";
  return "culture";
};

const getCategoryStyles = (cat) => {
  const styles = {
    festival: { color: "from-pink-500 to-rose-500", emoji: "🎪" },
    concert: { color: "from-purple-500 to-indigo-500", emoji: "🎵" },
    sports: { color: "from-orange-500 to-red-500", emoji: "⚽" },
    culture: { color: "from-blue-500 to-cyan-500", emoji: "🎭" },
    food: { color: "from-green-500 to-emerald-500", emoji: "🍽️" },
  };
  return styles[cat] || { color: "from-gray-500 to-gray-600", emoji: "🎉" };
};

// --- SUB-COMPONENTS ---

const WeatherForecast = ({ weather, location }) => {
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

const EventListItem = ({ event }) => {
  const category = classifyEvent(event);
  const { color, emoji } = getCategoryStyles(category);

  return (
    <div className="group relative bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-xl transition-all duration-300 mb-4 overflow-hidden shadow-sm">
      <div className="flex gap-4 relative z-10">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center text-3xl shrink-0 shadow-md transform group-hover:scale-110 transition-transform`}>
          {emoji}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{event.title}</h4>
              <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${color} text-white uppercase tracking-wider mt-1`}>{category}</span>
            </div>
            <Button href={event.link} target="_blank" variant="contained" className={`rounded-full px-6 bg-gradient-to-r ${color} text-white font-bold text-xs shadow-lg`}>Get Tickets</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" /><span>{event.date?.when || "TBD"}</span></div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-500" /><span>{event.venue?.name || "Local Venue"}</span></div>
            <div className="flex items-center gap-2 text-green-600 font-semibold"><Ticket className="w-4 h-4" /><span>Official Entry</span></div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
};

const Feature = ({ icon, bg, title, desc }) => (
  <div className="text-center group">
    <div className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm`}>{icon}</div>
    <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
    <p className="text-xs text-gray-500">{desc}</p>
  </div>
);

// --- MAIN PAGE COMPONENT ---

function HomePage() {
  const navigate = useNavigate();
  
  // States
  const [formData, setFormData] = useState({ destination: '', startDate: '', endDate: '', category: '' });
  const [events, setEvents] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auth States
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  const categoryCounts = useMemo(() => {
    const counts = { festival: 0, concert: 0, sports: 0, culture: 0, food: 0 };
    events.forEach(event => {
      const cat = classifyEvent(event);
      if (counts[cat] !== undefined) counts[cat]++;
    });
    return counts;
  }, [events]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleClear = () => { 
    setFormData({ destination: '', startDate: '', endDate: '', category: '' }); 
    setEvents([]); 
    setWeather(null);
    setHasSearched(false); 
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!formData.destination.trim()) return;
    
    setLoading(true);
    setHasSearched(true);

    try {
      const eventRes = await apiService.get("/search-events", { params: formData });
      setEvents(eventRes.data);

      const weatherRes = await fetch(`http://localhost:5001/api/weather?city=${formData.destination}`);
      const weatherData = await weatherRes.json();
      if (weatherRes.ok) {
        setWeather(weatherData);
      }
    } catch (err) {
      console.error("Data Fetching Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSelectMode = (mode) => {
    if (mode === 'ai') navigate('/ai-planner', { state: formData });
    else navigate('/manual-planner', { state: formData });
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 transition-all duration-500">
      
      {/* NAVIGATION HEADER */}
      <header className="px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(0)}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">WiseTrek</span>
        </div>

        {/* AUTH UI LOGIC */}
        {user ? (
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm uppercase">
                  {user.name.charAt(0)}
                </div>
                <Typography className="font-bold text-gray-800 text-sm">{user.name}</Typography>
             </div>
             <Tooltip title="Logout">
                <IconButton onClick={() => setUser(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </IconButton>
             </Tooltip>
          </div>
        ) : (
          <Button 
            variant="outlined" 
            className="rounded-full px-6 transition-all duration-300" 
            onClick={() => setShowAuth(true)}
            sx={{ borderRadius: '9999px', border: '2px solid #030213 !important', color: '#030213 !important', fontWeight: '700', textTransform: 'none', backgroundColor: 'white' }}
          >
            <User className="w-4 h-4 mr-2" /> Sign In
          </Button>
        )}
      </header>

      {/* AUTH BOT MODAL */}
      {showAuth && (
        <AuthBot 
          onClose={() => setShowAuth(false)} 
          onSuccess={handleAuthSuccess} 
        />
      )}

      <Container maxWidth="lg" className="pt-12 pb-24">
        
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">Where to next?</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Discover the perfect blend of local events and real-time weather for your next adventure.</p>
        </div>

        {/* UNIFIED SEARCH CARD */}
        <Paper elevation={0} className="p-6 md:p-8 rounded-[3rem] shadow-2xl bg-white border border-white mb-16 max-w-5xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <Typography className="text-xs font-bold text-gray-400 uppercase ml-2 mb-2 tracking-widest">Destination</Typography>
                <TextField fullWidth placeholder="City name..." name="destination" value={formData.destination} onChange={handleChange} variant="standard" 
                  InputProps={{ disableUnderline: true, startAdornment: <MapPin size={18} className="mr-2 text-blue-500" /> }} className="bg-gray-50 p-4 rounded-3xl" />
              </div>
              <div className="md:col-span-3">
                <Typography className="text-xs font-bold text-gray-400 uppercase ml-2 mb-2 tracking-widest">Start Date</Typography>
                <TextField type="date" fullWidth name="startDate" value={formData.startDate} onChange={handleChange} variant="standard" InputProps={{ disableUnderline: true }} className="bg-gray-50 p-4 rounded-3xl" />
              </div>
              <div className="md:col-span-3">
                <Typography className="text-xs font-bold text-gray-400 uppercase ml-2 mb-2 tracking-widest">End Date</Typography>
                <TextField type="date" fullWidth name="endDate" value={formData.endDate} onChange={handleChange} variant="standard" InputProps={{ disableUnderline: true }} className="bg-gray-50 p-4 rounded-3xl" />
              </div>
              <div className="md:col-span-2">
                <Typography className="text-xs font-bold text-gray-400 uppercase ml-2 mb-2 tracking-widest">Interest</Typography>
                <TextField select fullWidth name="category" value={formData.category} onChange={handleChange} variant="standard" InputProps={{ disableUnderline: true }} className="bg-gray-50 p-4 rounded-3xl">
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="music">Music</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                  <MenuItem value="food">Food</MenuItem>
                </TextField>
              </div>
            </div>

            {/* BUTTON GROUP: SEARCH & CLEAR */}
            <div className="flex flex-col md:flex-row gap-4">
              <Button 
                type="submit" 
                fullWidth 
                disabled={loading} 
                className="h-16 rounded-[1.5rem] bg-[#030213] hover:bg-gray-800 text-white font-black text-lg transition-all shadow-xl flex-[3]"
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Discover Your Journey"}
              </Button>
              
              <Button 
                onClick={handleClear}
                className="h-16 rounded-[1.5rem] bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 font-bold transition-all border border-gray-200 flex-1"
                startIcon={<RotateCcw size={20} />}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </Paper>

        {hasSearched ? (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
             {weather && <WeatherForecast weather={weather} location={formData.destination} />}

             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center shadow-lg">
                      <Calendar className="w-6 h-6 text-white" />
                   </div>
                   <Typography variant="h5" className="font-bold text-gray-900 text-2xl tracking-tight">Hand-picked Events</Typography>
                </div>
                <Button onClick={() => setHasSearched(false)} size="small" className="text-gray-400 hover:text-red-500 font-bold transition-colors">
                   <X size={18} className="mr-1" /> Hide Results
                </Button>
             </div>

             <div className="space-y-4">
               {events.length > 0 ? (
                 events.map((item, index) => <EventListItem key={index} event={item} />)
               ) : (
                 <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-gray-400">
                    No events found. Try widening your date range!
                 </div>
               )}
             </div>

             <div className="mt-12 p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
               <div className="grid grid-cols-5 gap-4">
                 {Object.entries(categoryCounts).map(([cat, count]) => {
                   const { emoji } = getCategoryStyles(cat);
                   return (
                     <div key={cat} className="text-center group">
                       <div className="text-3xl mb-2 group-hover:scale-125 transition-transform">{emoji}</div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cat}</p>
                       <p className="text-xl font-black text-gray-800">{count}</p>
                     </div>
                   );
                 })}
               </div>
             </div>
          </div>
        ) : (
          <div className="space-y-20">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div onClick={() => onSelectMode('manual')} className="group relative bg-white rounded-[2.5rem] p-10 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-blue-500 h-[420px] flex flex-col shadow-sm">
                <div className="relative flex-grow">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-blue-600"><User size={32} /></div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Custom Manual Plan</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">Take the driver's seat. Hand-pick every stop, hotel, and local activity with our step-by-step advisor.</p>
                </div>
                <Button variant="contained" fullWidth onClick={(e) => { e.stopPropagation(); onSelectMode('manual'); }} 
                  className="w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 !text-white hover:to-blue-800 font-bold py-3 shadow-lg">
                  Start Planning
                </Button>
              </div>

              <div onClick={() => onSelectMode('ai')} className="group relative bg-white rounded-[2.5rem] p-10 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-purple-500 h-[420px] flex flex-col shadow-sm">
                <div className="relative flex-grow">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-purple-600"><Sparkles size={32} /></div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Instant Advisor</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">Let our artificial intelligence craft the perfect day-trip instantly based on your mood and budget.</p>
                </div>
                <Button variant="contained" fullWidth onClick={(e) => { e.stopPropagation(); onSelectMode('ai'); }} 
                  className="w-full rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 !text-white font-bold py-3 shadow-lg">
                  Let AI Plan
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto pb-10">
               <Feature icon={<CloudSun className="text-blue-600"/>} bg="bg-blue-100" title="Live Weather" desc="Updated real-time"/>
               <Feature icon={<Route className="text-purple-600"/>} bg="bg-purple-100" title="Smart Routes" desc="Optimized paths"/>
               <Feature icon={<Wallet className="text-pink-600"/>} bg="bg-pink-100" title="Budgeting" desc="Cost management"/>
               <Feature icon={<CalendarRange className="text-orange-600"/>} bg="bg-orange-100" title="Local Events" desc="Exclusive access"/>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default HomePage;