import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Paper, TextField, CircularProgress, Container, MenuItem, Tooltip, IconButton } from "@mui/material";
import { MapPin, User, X, Calendar, RotateCcw, LogOut } from "lucide-react";

import apiService from "../services/apiService";
import { AuthBot } from "../components/AuthBot";
import { useAuth } from "../hooks/useAuth";
import { WeatherForecast } from "../components/WeatherForecast";
import { EventListItem } from "../components/EventListItem";
import { PlannerOptions } from "../components/PlannerOptions";
import { classifyEvent, getCategoryStyles } from "../utils/eventUtils";
import "../index.css";

function HomePage() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth(); 

  // States
  const [formData, setFormData] = useState({ destination: '', startDate: '', endDate: '', category: '' });
  const [events, setEvents] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

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
    if (mode === 'ai') navigate('/ai-planner', { state: formData });
    else navigate('/manual-planner', { state: formData });
  };

  const handleAuthSuccess = (userData) => {
    login(userData);
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 transition-all duration-500 font-sans">
      
      {/* HEADER */}
      <header className="px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(0)}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">WiseTrek</span>
        </div>

        {user ? (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 bg-white pl-1 pr-5 py-1 rounded-full shadow-sm border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm">
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
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">Where to next?</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Discover the perfect blend of local events and real-time weather for your next adventure.</p>
        </div>

        {/* SEARCH FORM */}
        <Paper elevation={0} className="p-6 md:p-8 rounded-[3rem] shadow-2xl bg-white border border-white mb-16 max-w-5xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <Typography className="text-xs font-bold text-gray-400 uppercase ml-2 mb-2 tracking-widest">Destination</Typography>
                <TextField fullWidth placeholder="City name..." name="destination" value={formData.destination} onChange={handleChange} variant="standard" InputProps={{ disableUnderline: true, startAdornment: <MapPin size={18} className="mr-2 text-blue-500" /> }} className="bg-gray-50 p-4 rounded-3xl" />
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

            <div className="flex flex-col md:flex-row gap-4">
              <Button type="submit" fullWidth disabled={loading} className="h-16 rounded-[1.5rem] bg-[#030213] hover:bg-gray-800 text-white font-black text-lg transition-all shadow-xl flex-[3]">
                {loading ? <CircularProgress size={24} color="inherit" /> : "Discover Your Journey"}
              </Button>
              <Button onClick={handleClear} className="h-16 rounded-[1.5rem] bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 font-bold transition-all border border-gray-200 flex-1" startIcon={<RotateCcw size={20} />}>
                Clear
              </Button>
            </div>
          </form>
        </Paper>

        {/* CONDITIONAL RENDERING: RESULTS OR PLANNER OPTIONS */}
        {hasSearched ? (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
             {weather && <WeatherForecast weather={weather} location={formData.destination} />}

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