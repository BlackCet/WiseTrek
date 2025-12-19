import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Paper, Typography, TextField, IconButton, Fab, Avatar, Slide 
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// --- 🧠 THE BRAIN (Knowledge Base) ---
// This acts as your "Free AI". Add as many rules as you want.
const KNOWLEDGE_BASE = [
  // --- 1. GREETINGS & PERSONALITY ---
  { 
    keywords: ['hi', 'hello', 'hey', 'greetings', 'morning', 'evening', 'sup', 'yo'], 
    answer: "Greetings, traveler! I am the WiseTrek Assistant. Ready to help you navigate the modern world with vintage charm. What's on your mind?" 
  },
  { 
    keywords: ['who are you', 'what do you do', 'your name', 'bot', 'help'], 
    answer: "I am the WiseTrek Station Master! I can help you find events, explain our AI Trip Planner, or assist with booking questions. Just type a keyword like 'refund', 'tickets', or 'Delhi'!" 
  },

  // --- 2. BOOKING & PAYMENTS (The Essentials) ---
  { 
    keywords: ['book', 'ticket', 'buy', 'purchase', 'price', 'cost', 'how much', 'reservation'], 
    answer: "To secure your spot, click the 'Book Tickets' button on any event card. This will take you directly to the official vendor's booth. We don't handle the cash here at the station—we just point you to the right platform!" 
  },
  { 
    keywords: ['refund', 'money', 'cancel', 'return', 'wrong ticket', 'mistake'], 
    answer: "Change of heart? Since we refer you to outside vendors (like BookMyShow or Ticketmaster), you'll need to follow their specific refund policy found in your confirmation email." 
  },
  { 
    keywords: ['confirmation', 'email', 'not received', 'receipt', 'invoice'], 
    answer: "If the telegraph (email) hasn't arrived, please check your 'Spam' folder. If it's still missing, you'll need to contact the specific ticket provider you purchased from." 
  },

  // --- 3. AI TRIP PLANNER (Feature Support) ---
  { 
    keywords: ['ai', 'plan', 'trip', 'itinerary', 'planner', 'advisor', 'suggest', 'route'], 
    answer: "Our AI Advisor is world-class! Head to the Home Page and click the black 'Plan a Full Trip' button. It will generate a custom 1-day itinerary just for you." 
  },
  { 
    keywords: ['vintage', '1920', 'theme', 'why'], 
    answer: "WiseTrek celebrates the 'Golden Age of Travel.' We believe modern journeys are better with a touch of classic elegance and storytelling." 
  },

  // --- 4. TECHNICAL ISSUES (Troubleshooting) ---
  { 
    keywords: ['broken', 'not working', 'error', 'slow', 'spin', 'stuck', 'blank', 'empty', 'bug'], 
    answer: "Terribly sorry for the technical hiccup! Try refreshing your browser (F5). If the AI is stuck, our 'Station Master' might be over capacity—give it a minute and try again." 
  },
  { 
    keywords: ['search', 'no results', 'found nothing', 'not showing', 'where is'], 
    answer: "If your search is coming up empty, try broadening your destination (e.g., 'Mumbai' instead of a small neighborhood) or selecting 'All Events' in the category menu." 
  },

  // --- 5. CATEGORY SPECIFIC QUERIES ---
  { 
    keywords: ['music', 'concert', 'gig', 'show', 'band', 'dj', 'festival'], 
    answer: "Seeking some rhythm? Set your category to 'Music' on the home page. We track everything from underground jazz to grand stadium concerts." 
  },
  { 
    keywords: ['sport', 'cricket', 'ipl', 'match', 'stadium', 'game'], 
    answer: "For the sporting soul! Search for your city and select the 'Cricket' or 'Sport' category to find the next big match." 
  },
  { 
    keywords: ['food', 'eat', 'restaurant', 'dinner', 'cafe', 'hungry'], 
    answer: "While we specialize in events, our AI Trip Planner loves suggesting historic breakfast spots and hidden gem dinners. Give it a try!" 
  },

  // --- 6. MISC & CONTACT ---
  { 
    keywords: ['contact', 'email', 'phone', 'support', 'human', 'talk to someone', 'address'], 
    answer: "Need a human touch? You can reach our head office at support@wisetrek.com. We usually reply within one business day." 
  },
  { 
    keywords: ['thank', 'thanks', 'cool', 'great', 'awesome', 'bye', 'goodbye'], 
    answer: "You are most welcome! Safe travels, and may your journey be filled with wonder. Farewell for now!" 
  }
];

const DEFAULT_ANSWER = "I beg your pardon? I didn't quite catch that. Try asking about 'tickets', 'refunds', or 'AI planning'.";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Welcome to WiseTrek! How can I help you?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    
    const lowerInput = input.toLowerCase();
    setInput("");

    // 2. Find the Answer (The Logic)
    let botResponse = DEFAULT_ANSWER;
    
    // Check if input contains any keyword from our knowledge base
    const foundRule = KNOWLEDGE_BASE.find(rule => 
      rule.keywords.some(keyword => lowerInput.includes(keyword))
    );

    if (foundRule) {
      botResponse = foundRule.answer;
    }

    // 3. Add Bot Message (with a tiny fake delay for realism)
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* --- Floating Action Button (The Trigger) --- */}
      <Fab 
        color="primary" 
        aria-label="chat"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#D8AE7E', // Clay
          '&:hover': { backgroundColor: '#C09A6E' },
          zIndex: 1000
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {/* --- The Chat Window --- */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper 
          elevation={6}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: 320,
            height: 450,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            overflow: 'hidden',
            zIndex: 1000,
            border: '2px solid #D8AE7E'
          }}
        >
          {/* Header */}
          <Box sx={{ bgcolor: '#D8AE7E', p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToyIcon sx={{ color: 'white' }} />
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
              Station Master
            </Typography>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#FFF2D7' }}>
            {messages.map((msg, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: msg.isBot ? 'flex-start' : 'flex-end',
                  mb: 2 
                }}
              >
                {msg.isBot && <Avatar sx={{ width: 28, height: 28, bgcolor: '#D8AE7E', mr: 1, fontSize: 12 }}>WT</Avatar>}
                <Paper 
                  elevation={1}
                  sx={{ 
                    p: 1.5, 
                    maxWidth: '80%', 
                    borderRadius: 2,
                    bgcolor: msg.isBot ? 'white' : '#D8AE7E',
                    color: msg.isBot ? 'black' : 'white',
                    fontSize: '0.9rem'
                  }}
                >
                  {msg.text}
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 1, bgcolor: 'white', borderTop: '1px solid #eee', display: 'flex', gap: 1 }}>
            <TextField 
              fullWidth 
              placeholder="Ask for help..." 
              variant="outlined"
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&.Mui-focused fieldset': { borderColor: '#D8AE7E' }, 
                }
              }}
            />
            <IconButton onClick={handleSend} color="primary" sx={{ color: '#D8AE7E' }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
}

export default ChatBot;