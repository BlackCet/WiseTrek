import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Paper, TextField, Button, Box, CircularProgress, Stack, Divider 
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReactMarkdown from 'react-markdown'; // ✅ Import Markdown Library
import api from '../services/apiService'; 
import '../index.css';

function AiResponse() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialDest = location.state?.destination || '';
  const initialCat = location.state?.category || '';

  const [destination, setDestination] = useState(initialDest);
  const [category, setCategory] = useState(initialCat);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialDest) {
      handleAskAI(initialDest, initialCat);
    }
  }, [initialDest]); 

  const handleAskAI = async (dest, cat) => {
    if (!dest) return;
    setLoading(true);
    setResponse('');
    
    try {
      // ✅ Using clean endpoint (removed extra /api)
      const res = await api.post('/ai/plan-trip', { 
        destination: dest,
        category: cat 
      });
      setResponse(res.data.answer);

    } catch (err) {
      console.error("API Error:", err);
      setResponse("The WiseTrek Guide is currently taking a nap. Please check if your server is running.");
    } finally {
      setLoading(false);
    }
  };

  const vintageInputSx = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': { borderColor: '#D8AE7E' }, 
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#D8AE7E' }
  };

  return (
    <div className="min-h-screen bg-wisetrek-100 py-10">
      <Container maxWidth="md">
        
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          className="text-wisetrek-400 font-bold mb-6 hover:bg-wisetrek-200 rounded-lg"
        >
          Back to Events
        </Button>

        <Box className="text-center mb-10">
          <Typography variant="h3" className="font-black text-wisetrek-400 flex items-center justify-center gap-3">
            <AutoAwesomeIcon fontSize="large" className="text-wisetrek-300" /> 
            WiseTrek Advisor
          </Typography>
          <Typography className="text-wisetrek-400 opacity-70 font-medium mt-2 text-lg">
            Your Vintage Guide to the Perfect Trip
          </Typography>
        </Box>

        <Paper elevation={0} className="p-8 rounded-3xl border-2 border-wisetrek-300 bg-white mb-8 shadow-sm">
          <Stack spacing={3}>
            <TextField 
              label="Where are you going?" 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)}
              fullWidth
              sx={vintageInputSx}
            />
            <TextField 
              label="Specific interests? (e.g., Jazz, History, Vegan Food)" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              sx={vintageInputSx}
            />
            <Button 
              variant="contained" 
              onClick={() => handleAskAI(destination, category)}
              disabled={loading || !destination}
              className="bg-wisetrek-400 hover:bg-wisetrek-300 text-white font-bold py-3 text-lg rounded-xl shadow-none"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Plan My Itinerary"}
            </Button>
          </Stack>
        </Paper>

        {response && (
          <Paper elevation={3} className="p-8 bg-wisetrek-100 border-l-8 border-wisetrek-400 rounded-r-2xl shadow-lg transition-all duration-500 ease-in-out">
            <Typography variant="h5" className="font-bold text-wisetrek-400 mb-4 font-serif">
              Itinerary for {destination}
            </Typography>
            <Divider className="border-wisetrek-300 mb-6 opacity-50" />
            
            {/* ✅ MARKDOWN RENDERER SECTION */}
            <div className="text-gray-800 text-lg font-serif leading-loose markdown-body">
              <ReactMarkdown
                components={{
                  // Convert **text** to bold using your theme color
                  strong: ({node, ...props}) => <span className="font-bold text-wisetrek-400" {...props} />,
                  
                  // Convert * bullet points into a styled list
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1 marker:text-wisetrek-300" {...props} />,
                  
                  // Handle headings if the AI sends them
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-wisetrek-400 mt-6 mb-2" {...props} />,
                }}
              >
                {response}
              </ReactMarkdown>
            </div>

            <Box className="mt-6 flex justify-end">
               <Typography variant="caption" className="text-wisetrek-400 opacity-50 italic">
                 Generated by WiseTrek AI
               </Typography>
            </Box>
          </Paper>
        )}

      </Container>
    </div>
  );
}

export default AiResponse;