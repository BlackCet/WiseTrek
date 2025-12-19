import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, Button, Paper, Box, TextField, Stack, 
  Card, CardMedia, CardContent, CardActions, Grid, 
  CircularProgress, Divider, Container, MenuItem 
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // Added missing import
import apiService from '../services/apiService';
import '../index.css'; 

// Individual Styled Event Card
const EventCard = ({ event }) => (
  <Card className="event-card border-2 border-wisetrek-300" sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4, boxShadow: 3 }}>
    <Box sx={{ overflow: 'hidden' }}>
      <CardMedia
        className="event-card-media"
        component="img"
        height="180"
        image={event.thumbnail || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500'}
        alt={event.title}
      />
    </Box>
    <CardContent sx={{ flexGrow: 1 }} className="bg-wisetrek-100">
      <Typography variant="h6" className="event-title font-bold text-wisetrek-400 mb-1">
        {event.title}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <CalendarMonthIcon fontSize="small" className="text-wisetrek-400" />
        <Typography variant="body2" className="text-wisetrek-400 opacity-80">{event.date?.when || "View Schedule"}</Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <PlaceIcon fontSize="small" className="text-wisetrek-400" />
        <Typography variant="body2" className="text-wisetrek-400 opacity-80">{event.venue?.name || "Local Venue"}</Typography>
      </Stack>
    </CardContent>
    <Divider className="border-wisetrek-300" />
    <CardActions sx={{ p: 2 }} className="bg-wisetrek-200">
      <Button 
        fullWidth 
        variant="contained" 
        href={event.link} 
        target="_blank" 
        sx={{ borderRadius: 2 }}
        className="bg-wisetrek-400 hover:bg-wisetrek-300 text-white shadow-none"
      >
        Book Tickets
      </Button>
    </CardActions>
  </Card>
);

function HomePage() {
  // ✅ FIX: Hook called INSIDE the component
  const navigate = useNavigate();

  const initialForm = { destination: '', startDate: '', endDate: '', category: '' };
  const [formData, setFormData] = useState(initialForm);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleClear = () => {
    setFormData(initialForm);
    setEvents([]);
    setHasSearched(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    setHasSearched(true);
    
    try {
      const params = { ...formData };
      const response = await apiService.get('/search-events', { params });
      setEvents(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wisetrek-100">
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h2" align="center" className="font-black text-wisetrek-400 mb-8">
          WISETREK
        </Typography>
        
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mb: 6 }} className="border-2 border-wisetrek-300">
          <form onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField 
                  fullWidth 
                  label="Destination" 
                  name="destination" 
                  value={formData.destination} 
                  onChange={handleChange} 
                  required 
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': { borderColor: '#D8AE7E' }, 
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#D8AE7E' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField 
                  select 
                  fullWidth 
                  label="Category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#D8AE7E' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#D8AE7E' }
                  }}
                >
                  <MenuItem value="">All Events</MenuItem>
                  <MenuItem value="music">Music</MenuItem>
                  <MenuItem value="cricket">Cricket</MenuItem>
                  <MenuItem value="comedy">Comedy Shows</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField 
                   fullWidth 
                   label="From" 
                   type="date" 
                   name="startDate" 
                   value={formData.startDate} 
                   InputLabelProps={{ shrink: true }} 
                   onChange={handleChange} 
                   sx={{
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#D8AE7E' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#D8AE7E' }
                  }}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField 
                   fullWidth 
                   label="To" 
                   type="date" 
                   name="endDate" 
                   value={formData.endDate} 
                   InputLabelProps={{ shrink: true }} 
                   onChange={handleChange} 
                   sx={{
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#D8AE7E' },
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#D8AE7E' }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack direction="row" spacing={1}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    sx={{ height: 56, fontWeight: 'bold' }}
                    className="bg-wisetrek-400 hover:bg-wisetrek-300 text-white shadow-none"
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Explore"}
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={handleClear} 
                    sx={{ height: 56 }}
                    className="border-wisetrek-400 text-wisetrek-400 hover:bg-wisetrek-200"
                  >
                    Clear
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>

          {/* AI Button Section */}
          <Box className="mt-6 mb-2 text-center">
            <Button 
              onClick={() => navigate('/ai-planner', { 
                state: { destination: formData.destination, category: formData.category } 
              })}
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              className="bg-black text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
            >
              Plan a Full Trip for {formData.destination || "Your Next Destination"}
            </Button>
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
            <CircularProgress size={60} sx={{ color: '#D8AE7E' }} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {events.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}><EventCard event={item} /></Grid>
            ))}
          </Grid>
        )}
        
        {hasSearched && events.length === 0 && !loading && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="h6" className="text-wisetrek-400">
              No events found for {formData.destination}.
            </Typography>
            <Typography variant="body2" className="text-wisetrek-400 opacity-70" sx={{ mt: 1 }}>
              Try searching for a major city or a broader category.
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
}

export default HomePage;