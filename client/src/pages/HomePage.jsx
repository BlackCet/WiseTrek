import React, { useState, useMemo, useEffect } from "react"; // Added useEffect here
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation here
import { Typography, Button, Paper, TextField, CircularProgress, Container, MenuItem, Tooltip, IconButton } from "@mui/material";
import { MapPin, User, X, Calendar, RotateCcw, LogOut } from "lucide-react";
import { CalendarDays, Compass } from "lucide-react";
import "../index.css";
import apiService from "../services/apiService";
import { AuthBot } from "../components/AuthBot";
import { useAuth } from "../context/AuthContext";
import HotelList from "../components/HotelList";
import { WeatherForecast } from "../components/WeatherForecast";
import { EventListItem } from "../components/EventListItem";
import { PlannerOptions } from "../components/PlannerOptions";
import { classifyEvent, getCategoryStyles } from "../utils/eventUtils";


function HomePage() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to read router state
  const { user, login, logout } = useAuth(); 

  // States
  const [formData, setFormData] = useState({ destination: '', startDate: '', endDate: '', category: '' });
  const [events, setEvents] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // --- NEW: Catch the trigger from ProtectedRoute ---
  useEffect(() => {
    if (location.state?.triggerAuthBot) {
      setShowAuth(true); // Pop the bot
      
      // Clean up the history state so refreshing the page doesn't keep popping the bot
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  // --------------------------------------------------

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
      if (weatherRes.ok) setWeather(weatherData);
    } catch (err) {
      console.error("Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSelectMode = (mode) => {
    // If user is not logged in, pop the bot instead of navigating
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    if (mode === 'ai') navigate('/ai-planner', { state: formData });
    else navigate('/manual-planner', { state: formData });
  };

  const handleAuthSuccess = (userData) => {
    login(userData);
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-50 via-purple-50 to-pink-50 transition-all duration-500 font-sans">
      
      {/* HEADER */}
      <header className="px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(0)}>
          <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">WiseTrek</span>
        </div>

        {user ? (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 bg-white pl-1 pr-5 py-1 rounded-full shadow-sm border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm">
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-none">Traveler</p>
                  <Typography className="font-bold text-gray-800 text-sm leading-none mt-1">{user.name}</Typography>
                </div>
              </div>
              <Tooltip title="Logout">
                <IconButton onClick={logout} className="bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all border border-gray-100 shadow-sm">
                  <LogOut size={18} />
                </IconButton>
              </Tooltip>
          </div>
        ) : (
          <Button variant="outlined" onClick={() => setShowAuth(true)}
            sx={{ borderRadius: '9999px', border: '2px solid #030213 !important', color: '#030213 !important', fontWeight: '700', px: 4, backgroundColor: 'white', textTransform: 'none' }}>
            <User className="w-4 h-4 mr-2" /> Sign In
          </Button>
        )}
      </header>

      {showAuth && <AuthBot onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}

      <Container maxWidth="lg" className="pt-12 pb-24">
        <div className="text-center mb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent leading-tight tracking-tight drop-shadow-sm">
            Where to next?
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Discover the perfect blend of local events and real-time weather for your next adventure.
          </p>
        </div>

        {/* SEARCH FORM */}
        <Paper 
          elevation={0} 
          className="p-6 md:p-8 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-xl border border-white mb-16 max-w-5xl mx-auto"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Destination */}
              <div className="md:col-span-4 group">
                <Typography className="text-[10px] font-black text-gray-400 uppercase ml-4 mb-2 tracking-widest group-hover:text-blue-500 transition-colors duration-300">
                  Destination
                </Typography>
                <div className="bg-gray-50/80 group-hover:bg-blue-50/50 border border-transparent group-hover:border-blue-100 rounded-3xl p-3 transition-all duration-300">
                  <TextField 
                    fullWidth 
                    placeholder="City name..." 
                    name="destination" 
                    value={formData.destination} 
                    onChange={handleChange} 
                    variant="standard" 
                    InputProps={{ 
                      disableUnderline: true, 
                      startAdornment: <MapPin size={20} className="mr-3 text-blue-500" /> 
                    }} 
                    className="px-2" 
                  />
                </div>
              </div>

              {/* Start Date */}
              <div className="md:col-span-3 group">
                <Typography className="text-[10px] font-black text-gray-400 uppercase ml-4 mb-2 tracking-widest group-hover:text-purple-500 transition-colors duration-300">
                  Start Date
                </Typography>
                <div className="bg-gray-50/80 group-hover:bg-purple-50/50 border border-transparent group-hover:border-purple-100 rounded-3xl p-3 transition-all duration-300 flex items-center">
                  <CalendarDays size={20} className="ml-2 mr-3 text-purple-500 shrink-0" />
                  <TextField 
                    type="date" 
                    fullWidth 
                    name="startDate" 
                    value={formData.startDate} 
                    onChange={handleChange} 
                    variant="standard" 
                    InputProps={{ disableUnderline: true }} 
                    className="pr-2 w-full" 
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="md:col-span-3 group">
                <Typography className="text-[10px] font-black text-gray-400 uppercase ml-4 mb-2 tracking-widest group-hover:text-pink-500 transition-colors duration-300">
                  End Date
                </Typography>
                <div className="bg-gray-50/80 group-hover:bg-pink-50/50 border border-transparent group-hover:border-pink-100 rounded-3xl p-3 transition-all duration-300 flex items-center">
                  <CalendarDays size={20} className="ml-2 mr-3 text-pink-500 shrink-0" />
                  <TextField 
                    type="date" 
                    fullWidth 
                    name="endDate" 
                    value={formData.endDate} 
                    onChange={handleChange} 
                    variant="standard" 
                    InputProps={{ disableUnderline: true }} 
                    className="pr-2 w-full" 
                  />
                </div>
              </div>

              {/* Interest */}
              <div className="md:col-span-2 group">
                <Typography className="text-[10px] font-black text-gray-400 uppercase ml-4 mb-2 tracking-widest group-hover:text-orange-500 transition-colors duration-300">
                  Interest
                </Typography>
                <div className="bg-gray-50/80 group-hover:bg-orange-50/50 border border-transparent group-hover:border-orange-100 rounded-3xl p-3 transition-all duration-300 flex items-center">
                  <Compass size={20} className="ml-2 mr-3 text-orange-500 shrink-0" />
                  <TextField 
                    select 
                    fullWidth 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    variant="standard" 
                    InputProps={{ disableUnderline: true }} 
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: {
                        PaperProps: {
                          className: "rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 mt-2 p-1",
                          elevation: 0
                        }
                      }
                    }}
                    className="pr-2 w-full"
                  >
                    <MenuItem value="" className="rounded-xl mx-1 my-0.5 text-sm font-medium hover:bg-gray-50 transition-colors">All Events</MenuItem>
                    <MenuItem value="music" className="rounded-xl mx-1 my-0.5 text-sm font-medium hover:bg-gray-50 transition-colors">Music</MenuItem>
                    <MenuItem value="sports" className="rounded-xl mx-1 my-0.5 text-sm font-medium hover:bg-gray-50 transition-colors">Sports</MenuItem>
                    <MenuItem value="food" className="rounded-xl mx-1 my-0.5 text-sm font-medium hover:bg-gray-50 transition-colors">Food</MenuItem>
                  </TextField>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <Button 
                type="submit" 
                fullWidth 
                disabled={loading} 
                className="h-14 md:h-16 rounded-full bg-[#030213] hover:bg-black text-white font-semibold text-lg transition-all duration-200 shadow-none hover:shadow-lg active:scale-[0.98] flex-[3]"
              >
                {loading ? <CircularProgress size={24} color="inherit" thickness={4} /> : "Discover Your Journey"}
              </Button>
              <Button 
                onClick={handleClear} 
                className="h-16 rounded-[1.5rem] bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 font-bold transition-all duration-300 border border-gray-100 flex-1 group" 
              >
                <RotateCcw size={20} className="mr-2 group-hover:-rotate-180 transition-transform duration-500" />
                Clear
              </Button>
            </div>
          </form>
        </Paper>

        {/* CONDITIONAL RENDERING: RESULTS OR PLANNER OPTIONS */}
        {hasSearched ? (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
             {weather && <WeatherForecast weather={weather} location={formData.destination} />}

             {/* ✅ STAY RECOMMENDATIONS FIRST */}
    <HotelList
      destination={formData.destination}
      startDate={formData.startDate}
      endDate={formData.endDate}
    />

             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center shadow-lg">
                      <Calendar className="w-6 h-6 text-white" />
                   </div>
                   <Typography variant="h5" className="font-bold text-gray-900 text-2xl tracking-tight">Upcoming Events</Typography>
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
                   No events found for this selection.
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
          <PlannerOptions onSelectMode={onSelectMode} />
        )}
      </Container>
    </div>
  );
}

export default HomePage;