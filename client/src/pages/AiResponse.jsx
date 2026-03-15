import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// MUI Components - ALL defined and imported here
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Avatar, 
  CircularProgress, 
  Container, 
  TextField, 
  Divider, 
  IconButton 
} from '@mui/material';

// Icons - From Lucide React
import { ArrowLeft, Sparkles, Bot, User, Send, MapPin } from 'lucide-react';

// Markdown and API
import ReactMarkdown from 'react-markdown';
import api from '../services/apiService';
import '../index.css';

function AiResponse() {
  const navigate = useNavigate();
  const location = useLocation();

  // Safety check for destination passed from HomePage
  const initialDest = location.state?.destination || '';

  const [step, setStep] = useState(initialDest ? 'preferences' : 'welcome'); 
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finalItinerary, setFinalItinerary] = useState('');
  const [input, setInput] = useState("");

  const [planData, setPlanData] = useState({
    destination: initialDest,
    preferences: '',
    budget: '',
    duration: ''
  });

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initialize the chat with the first bot message
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Prevent double-welcome messages in React Strict Mode
    if (messages.length > 0) return;

    const welcomeText = initialDest 
      ? `✨ Splendid! I see you're interested in ${initialDest}. I'm your WiseTrek Advisor.\n\nTo craft the perfect itinerary, tell me: what is your travel style? (e.g., Luxury, Adventure, or Cultural exploration?)`
      : "✨ Welcome to the WiseTrek AI Advisor! I'm here to craft a journey specifically for you.\n\nTo begin, what is your dream destination?";
    
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages([{ text: welcomeText, isBot: true, timestamp: new Date() }]);
      setIsTyping(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [initialDest]);

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { text, isBot: true, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = async (textVal) => {
    const msg = textVal || input;
    if (!msg.trim()) return;

    // Add User Message
    setMessages(prev => [...prev, { text: msg, isBot: false, timestamp: new Date() }]);
    setInput("");

    let nextStep = step;
    let currentData = { ...planData };

    // Logic Tree
    if (step === 'welcome' || step === 'destination') {
      currentData.destination = msg;
      setPlanData(currentData);
      addBotMessage(`Excellent! ${msg} is a fine choice. 🌟\n\nWhat kind of experiences do you enjoy? (e.g., Jazz clubs, History, or perhaps Vegan food?)`);
      nextStep = 'preferences';
    } 
    else if (step === 'preferences') {
      currentData.preferences = msg;
      setPlanData(currentData);
      addBotMessage("Understood. 💎\n\nWhat is your total budget for this trip? (e.g., $2000 or 'Budget-friendly')");
      nextStep = 'budget';
    }
    else if (step === 'budget') {
      currentData.budget = msg;
      setPlanData(currentData);
      addBotMessage("And finally, how long is your stay? (e.g., 5 days in Summer, or a weekend in April)");
      nextStep = 'duration';
    }
    else if (step === 'duration') {
      currentData.duration = msg;
      setPlanData(currentData);
      setStep('processing');
      handleFinalAPI(currentData);
    }
    setStep(nextStep);
  };

  const handleFinalAPI = async (data) => {
    addBotMessage("🔍 Consulting the maps and checking the local happenings. One moment please...");
    setLoading(true);

    try {
      const res = await api.post('/ai/plan-trip', { 
        destination: data.destination,
        category: `${data.preferences} | Budget: ${data.budget} | Duration: ${data.duration}` 
      });
      setFinalItinerary(res.data.answer);
      addBotMessage("✅ Your WiseTrek Itinerary is ready! Scroll down to explore. 🎉");
    } catch (err) {
      addBotMessage("⚠️ The telegraph lines are currently down. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-50 via-purple-50 to-pink-50 pb-20">
      <header className="p-6 max-w-7xl mx-auto flex items-center justify-between">
        <Button 
          onClick={() => navigate('/')} 
          startIcon={<ArrowLeft />} 
          className="rounded-full bg-white shadow-sm text-gray-600 px-6 py-2"
        >
          Back to Events
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-600" />
          <Typography className="font-bold text-gray-800">WiseTrek AI Advisor</Typography>
        </div>
      </header>

      <Container maxWidth="md">
        {/* CHAT WINDOW */}
        {!finalItinerary && (
          <Paper elevation={10} className="rounded-[2.5rem] overflow-hidden border border-white shadow-2xl h-[600px] flex flex-col bg-white/80 backdrop-blur-md">
            <Box className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    <Avatar className={msg.isBot ? "bg-purple-100 text-purple-600" : "bg-blue-600"}>
                      {msg.isBot ? <Bot size={20}/> : <User size={20}/>}
                    </Avatar>
                    <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.isBot ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                 <Box className="flex items-center gap-2 ml-12">
                   <CircularProgress size={16} className="text-purple-400" />
                   <Typography className="text-xs text-gray-400">Advisor is thinking...</Typography>
                 </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Box className="p-4 bg-white border-t flex gap-2">
              <TextField 
                fullWidth 
                placeholder="Type your message here..." 
                variant="standard"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                InputProps={{ disableUnderline: true }}
                className="bg-gray-100 px-6 py-3 rounded-full text-sm"
              />
              <IconButton 
                onClick={() => handleSendMessage()} 
                disabled={!input.trim()} 
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Send size={20} />
              </IconButton>
            </Box>
          </Paper>
        )}

        {/* RESULTS WINDOW */}
        {finalItinerary && (
          <Paper elevation={0} className="mt-10 p-8 md:p-12 rounded-[3rem] border border-white bg-white/90 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-700">
            <Typography variant="h4" className="font-black bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Your Personalized Journey
            </Typography>
            <Divider className="mb-8" />
            <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
              <ReactMarkdown
                components={{
                  strong: ({node, ...props}) => <span className="font-bold text-blue-600" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-l-4 border-purple-500 pl-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-none space-y-3 pl-0" {...props} />,
                  li: ({node, ...props}) => (
                    <li className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <MapPin size={18} className="text-blue-500 mt-1 shrink-0" />
                      <span {...props} />
                    </li>
                  ),
                }}
              >
                {finalItinerary}
              </ReactMarkdown>
            </div>
            <Button 
              fullWidth 
              variant="contained" 
              onClick={() => window.print()} 
              className="mt-12 rounded-full bg-black text-white py-4 font-bold text-lg hover:bg-gray-800 shadow-lg"
            >
              Save as PDF
            </Button>
          </Paper>
        )}
      </Container>
    </div>
  );
}

export default AiResponse;