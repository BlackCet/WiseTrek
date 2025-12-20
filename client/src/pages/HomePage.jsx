import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, Button, Paper, Box, TextField, 
  Grid, CircularProgress, Container, MenuItem 
} from '@mui/material';
import { 
  MapPin, Sparkles, User, X, CloudSun, 
  Route, Wallet, CalendarRange, Calendar, Clock, Ticket 
} from 'lucide-react';
import apiService from '../services/apiService';
import '../index.css'; 

/**
 * Logic to categorize raw event data into the 5 core categories based on keywords
 */
const classifyEvent = (event) => {
  const text = `${event.title} ${event.category || ''}`.toLowerCase();
  
  if (text.includes('music') || text.includes('concert') || text.includes('dj') || text.includes('gig') || text.includes('live')) 
    return 'concert';
  if (text.includes('match') || text.includes('cricket') || text.includes('football') || text.includes('sports') || text.includes('cup') || text.includes('race')) 
    return 'sports';
  if (text.includes('food') || text.includes('feast') || text.includes('dining') || text.includes('culinary') || text.includes('drink') || text.includes('restaurant')) 
    return 'food';
  if (text.includes('fest') || text.includes('carnival') || text.includes('fair') || text.includes('gala') || text.includes('celebration')) 
    return 'festival';
  
  return 'culture'; // Default category
};

const getCategoryStyles = (cat) => {
  const styles = {
    festival: { color: 'from-pink-500 to-rose-500', emoji: '🎪' },
    concert: { color: 'from-purple-500 to-indigo-500', emoji: '🎵' },
    sports: { color: 'from-orange-500 to-red-500', emoji: '⚽' },
    culture: { color: 'from-blue-500 to-cyan-500', emoji: '🎭' },
    food: { color: 'from-green-500 to-emerald-500', emoji: '🍽️' },
  };
  return styles[cat] || { color: 'from-gray-500 to-gray-600', emoji: '🎉' };
};

const EventListItem = ({ event }) => {
  const category = classifyEvent(event);
  const { color, emoji } = getCategoryStyles(category);

  return (
    <div className="group relative bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden mb-4">
      <div className="flex gap-4 relative z-10">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center text-3xl flex-shrink-0 shadow-md transform group-hover:scale-110 transition-transform`}>
          {emoji}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {event.title}
              </h4>
              <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${color} text-white uppercase tracking-wider mt-1`}>
                {category}
              </span>
            </div>
            <Button 
              href={event.link} 
              target="_blank"
              variant="contained" 
              className={`rounded-full px-6 bg-gradient-to-r ${color} text-white font-bold text-xs shadow-lg`}
            >
              Get Tickets
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{event.date?.when || "TBD"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-purple-500" />
              <span className="truncate">{event.venue?.name || "Local Venue"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
              <Ticket className="w-4 h-4" />
              <span>Official Entry</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  );
};

const Feature = ({ icon, bg, title, desc }) => (
  <div className="text-center group">
    <div className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
      {icon}
    </div>
    <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
    <p className="text-xs text-gray-500">{desc}</p>
  </div>
);

function HomePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ destination: '', startDate: '', endDate: '', category: '' });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Function to calculate counts based on our classification engine
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
    setHasSearched(false); 
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!formData.destination.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const response = await apiService.get('/search-events', { params: formData });
      setEvents(response.data);
    } catch (err) { 
      console.error("Search failed:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const onSelectMode = (mode) => {
    if (mode === 'ai') navigate('/ai-planner', { state: formData });
    else navigate('/manual-planner', { state: formData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 transition-all duration-500">
      <header className="px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(0)}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg"><MapPin className="w-6 h-6 text-white" /></div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">WiseTrek</span>
        </div>
        <Button variant="outline" className="rounded-full border-gray-300 bg-white shadow-sm px-6 hover:bg-gray-50 transition-colors"><User className="w-4 h-4 mr-2" /> Sign In</Button>
      </header>

      <Container maxWidth="lg" className="pt-12 pb-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">Plan Your Perfect Journey</h1>
        </div>

        <Paper elevation={0} className="p-4 md:p-6 rounded-[2rem] shadow-2xl bg-white/80 backdrop-blur-md border border-white mb-16 max-w-5xl mx-auto sticky top-4 z-10">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-9">
              <TextField fullWidth placeholder="Where to?" name="destination" value={formData.destination} onChange={handleChange} variant="standard" onKeyDown={(e) => e.key === 'Enter' && handleSearch()} InputProps={{ disableUnderline: true, startAdornment: <MapPin className="w-5 h-5 mr-2 text-blue-500" /> }} className="bg-gray-50 p-3 rounded-2xl border border-gray-100" />
            </div>
            <div className="md:col-span-3">
              <Button type="submit" fullWidth disabled={loading} className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg">
                {loading ? <CircularProgress size={20} color="inherit" /> : "Find Events"}
              </Button>
            </div>
          </form>
        </Paper>

        {hasSearched ? (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center shadow-lg">
                      <Calendar className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <Typography variant="h5" className="font-bold text-gray-900">Local Events</Typography>
                      <p className="text-sm text-gray-500">Hand-picked experiences in {formData.destination}</p>
                   </div>
                </div>
                <Button onClick={handleClear} size="small" className="text-gray-400 hover:text-red-500"><X size={16} className="mr-1" /> Clear Results</Button>
             </div>

             <div className="space-y-4">
               {events.map((item, index) => <EventListItem key={index} event={item} />)}
             </div>

             {/* Functional Events summary footer */}
             <div className="mt-12 p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
               <div className="grid grid-cols-5 gap-4">
                 {Object.entries(categoryCounts).map(([cat, count]) => {
                   const { emoji } = getCategoryStyles(cat);
                   return (
                     <div key={cat} className="text-center">
                       <div className="text-3xl mb-2">{emoji}</div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cat}</p>
                       <p className="text-xl font-black text-gray-800">{count}</p>
                     </div>
                   );
                 })}
               </div>
             </div>
          </div>
        ) : (
          <div className="space-y-24">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div onClick={() => onSelectMode('manual')} className="group relative bg-white rounded-[2.5rem] p-10 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-blue-500 h-[400px] flex flex-col">
                <div className="relative flex-grow">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-blue-600"><User size={32} /></div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Build Your Own</h3>
                  <p className="text-gray-600">Hand-pick every detail of your journey manually.</p>
                </div>
                <Button variant="contained" fullWidth onClick={(e) => { e.stopPropagation(); onSelectMode('manual'); }} className="rounded-full bg-blue-600 hover:bg-blue-700 py-3 font-bold mt-auto">Start Planning</Button>
              </div>

              <div onClick={() => onSelectMode('ai')} className="group relative bg-white rounded-[2.5rem] p-10 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-purple-500 h-[400px] flex flex-col">
                <div className="relative flex-grow">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-purple-600"><Sparkles size={32} /></div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">AI-Powered Planning</h3>
                  <p className="text-gray-600">Let our AI create the perfect itinerary for you based on preferences.</p>
                </div>
                <Button variant="contained" fullWidth onClick={(e) => { e.stopPropagation(); onSelectMode('ai'); }} className="rounded-full bg-purple-600 hover:bg-purple-700 py-3 font-bold mt-auto">Let AI Plan</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto pb-10">
               <Feature icon={<CloudSun className="text-blue-600"/>} bg="bg-blue-100" title="Weather" desc="Real-time updates"/>
               <Feature icon={<Route className="text-purple-600"/>} bg="bg-purple-100" title="Smart Routes" desc="Optimized travel"/>
               <Feature icon={<Wallet className="text-pink-600"/>} bg="bg-pink-100" title="Budgeting" desc="Cost tracking"/>
               <Feature icon={<CalendarRange className="text-orange-600"/>} bg="bg-orange-100" title="Events" desc="Discovery guide"/>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default HomePage;