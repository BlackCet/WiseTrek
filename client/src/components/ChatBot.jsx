import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Paper, Typography, TextField, IconButton, Fab, Avatar, Slide 
} from '@mui/material';
import { Send, MessageCircle, Sparkles, X, Bot } from 'lucide-react';

const KNOWLEDGE_BASE = [
  { keywords: ['hi', 'hello', 'hey'], answer: "Greetings, traveler! I am the WiseTrek Assistant. Ready to help you navigate with vintage charm." },
  { keywords: ['ai', 'plan', 'itinerary'], answer: "Our AI Advisor is world-class! Click the 'AI Plan' button on the homepage for a custom journey." },
  { keywords: ['ticket', 'book'], answer: "Secure your spot by clicking 'Book Tickets' on any event card. We'll guide you to the official vendor!" },
  { keywords: ['thank', 'thanks'], answer: "You're most welcome! Safe travels!" }
];

const DEFAULT_ANSWER = "I beg your pardon? Try asking about 'tickets', 'AI planning', or 'destinations'.";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Welcome to WiseTrek! How can I help you today?", isBot: true, timestamp: new Date() }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = { text: input, isBot: false, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
        // 2. Call your NEW Backend API
        const response = await fetch('http://localhost:5001/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: currentInput }),
        });
        
        const data = await response.json();

        // 3. Add Bot Message
        setMessages((prev) => [...prev, { 
            text: data.answer, 
            isBot: true, 
            timestamp: new Date() 
        }]);
    } catch (err) {
        setMessages((prev) => [...prev, { 
            text: "I'm sorry, traveler. The connection is weak.", 
            isBot: true, 
            timestamp: new Date() 
        }]);
    } finally {
        setIsTyping(false);
    }
};

  return (
    <>
      {/* Floating Action Button - FIXED to the viewport */}
      <Fab 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] transition-all duration-300"
        sx={{ 
          position: 'fixed', // Force fixed
          bottom: '24px',
          right: '24px',
          bgcolor: 'var(--primary)', 
          color: 'var(--primary-foreground)', 
          display: isOpen ? 'none' : 'flex', // Hide when open to show the 'X' in the header instead
          '&:hover': { bgcolor: 'var(--primary)' } 
        }}
      >
        <MessageCircle className="w-6 h-6" />
      </Fab>

      {/* Chat Window - FIXED to the viewport */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper 
          elevation={12}
          className="fixed z-[9999] flex flex-col overflow-hidden shadow-2xl"
          sx={{
            position: 'fixed',
            bottom: '24px', // Aligns with where the Fab was
            right: '24px',
            width: '350px',
            height: '500px',
            borderRadius: '2rem',
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: 'calc(100vh - 48px)',
          }}
        >
          {/* Header */}
          <Box className="p-4 bg-linear-to-r from-blue-600 to-purple-600 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <Typography className="text-white font-bold leading-tight">Station Master</Typography>
                <Typography className="text-white/70 text-[10px] uppercase tracking-wider">AI Assistant</Typography>
              </div>
            </div>
            <IconButton onClick={() => setIsOpen(false)} size="small" className="text-white/80 hover:bg-white/10">
              <X className="w-5 h-5" />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box className="flex-1 p-4 overflow-y-auto bg-gray-50/50 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                  {msg.isBot && <Avatar className="w-8 h-8 bg-blue-100 text-blue-600"><Bot size={16}/></Avatar>}
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.isBot 
                      ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' 
                      : 'bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-tr-none'
                  }`}>
                    {msg.text}
                    <span className={`block text-[10px] mt-1 opacity-50 ${msg.isBot ? 'text-gray-500' : 'text-white'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start items-center gap-2">
                <Avatar className="w-8 h-8 bg-gray-100"><Bot size={16} className="text-gray-400"/></Avatar>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 border border-gray-100">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
            <TextField 
              fullWidth 
              placeholder="Ask WiseTrek..." 
              variant="standard"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              InputProps={{ disableUnderline: true }}
              className="bg-gray-100 px-4 py-2 rounded-full text-sm"
            />
            <IconButton 
              onClick={handleSend} 
              disabled={!input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-200"
            >
              <Send className="w-4 h-4" />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
}

export default ChatBot;