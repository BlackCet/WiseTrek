import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// MUI Components - Fixed: Added IconButton and Divider to the list
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
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Bot, 
  Send, 
  Sparkles, 
  ClipboardList 
} from 'lucide-react';

// Markdown and API
import ReactMarkdown from 'react-markdown';
import api from '../services/apiService';
import '../index.css';

function ManualPlanner() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState('destination'); 
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finalItinerary, setFinalItinerary] = useState('');
  const [input, setInput] = useState("");

  const [planData, setPlanData] = useState({
    destination: location.state?.destination || '',
    dates: '',
    travelers: '',
    budget: '',
    accommodation: '',
    transportation: '',
    activities: ''
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (messages.length > 0) return;

    const welcomeText = "👋 Hello! I'm your manual travel planner. I'll help you build a custom itinerary step-by-step.\n\nFirst, where are we heading?";
    
    setIsTyping(true);
    setTimeout(() => {
      setMessages([{ text: welcomeText, isBot: true, timestamp: new Date() }]);
      setIsTyping(false);
    }, 800);
  }, []);

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

    setMessages(prev => [...prev, { text: msg, isBot: false, timestamp: new Date() }]);
    setInput("");

    let nextStep = step;
    let currentData = { ...planData };

    if (step === 'destination') {
      currentData.destination = msg;
      addBotMessage(`🌍 ${msg} sounds like a plan! When are you going? (e.g. March 15-20)`);
      nextStep = 'dates';
    } 
    else if (step === 'dates') {
      currentData.dates = msg;
      addBotMessage("📅 Perfect. How many travelers? (e.g. 2 adults)");
      nextStep = 'travelers';
    }
    else if (step === 'travelers') {
      currentData.travelers = msg;
      addBotMessage("💰 Got it. What is your total budget?");
      nextStep = 'budget';
    }
    else if (step === 'budget') {
      currentData.budget = msg;
      addBotMessage("🏨 Preferred accommodation style? (e.g. Hotels or Airbnbs)");
      nextStep = 'accommodation';
    }
    else if (step === 'accommodation') {
      currentData.accommodation = msg;
      addBotMessage("🚗 Transportation preference? (e.g. Rental car or Train)");
      nextStep = 'transportation';
    }
    else if (step === 'transportation') {
      currentData.transportation = msg;
      addBotMessage("🎯 What activities do you love? (e.g. Food, Museums, Hiking)");
      nextStep = 'activities';
    }
    else if (step === 'activities') {
      currentData.activities = msg;
      setStep('processing');
      handleFinalAPI(currentData);
    }

    setPlanData(currentData);
    setStep(nextStep);
  };

  const handleFinalAPI = async (data) => {
    addBotMessage("🔧 Customizing your detailed itinerary now...");
    setLoading(true);

    try {
      const detailedSpecs = `Dates: ${data.dates}, Travelers: ${data.travelers}, Budget: ${data.budget}, Stay: ${data.accommodation}, Transport: ${data.transportation}, Interests: ${data.activities}`;
      
      const res = await api.post('/ai/plan-trip', { 
        destination: data.destination,
        category: detailedSpecs 
      });

      setFinalItinerary(res.data.answer);
      addBotMessage("🎉 Your custom-built itinerary is ready below!");
    } catch (err) {
      addBotMessage("⚠️ Sorry, I couldn't finalize the plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      <header className="p-6 max-w-7xl mx-auto flex items-center justify-between">
        <Button onClick={() => navigate('/')} startIcon={<ArrowLeft />} className="rounded-full bg-white shadow-sm text-gray-600 px-6 py-2">
          Back
        </Button>
        <div className="flex items-center gap-2">
          <ClipboardList className="text-blue-600" />
          <Typography className="font-bold text-gray-800 uppercase tracking-widest">Manual Planner</Typography>
        </div>
      </header>

      <Container maxWidth="md">
        {!finalItinerary && (
          <Paper elevation={10} className="rounded-[2.5rem] overflow-hidden border border-white shadow-2xl h-[600px] flex flex-col bg-white/80 backdrop-blur-md">
            <Box className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    <Avatar className={msg.isBot ? "bg-blue-100 text-blue-600" : "bg-purple-600"}>
                      {msg.isBot ? <Bot size={20}/> : <User size={20}/>}
                    </Avatar>
                    <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.isBot ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' : 'bg-purple-600 text-white rounded-tr-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && <CircularProgress size={16} className="ml-12 text-blue-400" />}
              <div ref={messagesEndRef} />
            </Box>

            <Box className="p-4 bg-white border-t flex gap-2">
              <TextField 
                fullWidth 
                placeholder="Type your answer..." 
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

        {finalItinerary && (
          <Paper elevation={0} className="mt-10 p-8 md:p-12 rounded-[3rem] border border-white bg-white/90 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-center gap-3 mb-6">
               <Sparkles className="text-purple-600" />
               <Typography variant="h4" className="font-black text-gray-900">Custom Itinerary</Typography>
            </div>
            <Divider className="mb-8" />
            <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
              <ReactMarkdown
                components={{
                  strong: ({node, ...props}) => <span className="font-bold text-blue-600" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4 border-l-4 border-blue-500 pl-4" {...props} />,
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
            <Button fullWidth variant="contained" onClick={() => window.print()} className="mt-12 rounded-full bg-black text-white py-4 font-bold text-lg hover:bg-gray-800 shadow-lg">
              Download Trip Document
            </Button>
          </Paper>
        )}
      </Container>
    </div>
  );
}

export default ManualPlanner;