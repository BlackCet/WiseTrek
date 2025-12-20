import React, { useState, useEffect } from 'react';
import { X, User, Lock, Mail, MessageSquare } from 'lucide-react';
import { Button, CircularProgress } from '@mui/material';

// --- Helper: Chat Message Component ---
const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-in fade-in slide-in-from-bottom-2`}>
      <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
        isBot 
        ? 'bg-gray-100 text-gray-800 rounded-bl-none' 
        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
      }`}>
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
        <p className={`text-[10px] mt-1 opacity-50 ${isBot ? 'text-gray-500' : 'text-white'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export function AuthBot({ onClose, onSuccess, initialMode = 'login' }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState('welcome');
  const [authData, setAuthData] = useState({});

  useEffect(() => {
    // Initial Greeting
    const timer = setTimeout(() => {
      if (mode === 'login') {
        addBotMessage("👋 Welcome back! Let's get you signed in.\n\nPlease enter your email address to continue.");
        setStep('email');
      } else {
        addBotMessage("🎉 Great! Let's create your WiseTrek account.\n\nFirst, what's your full name?");
        setStep('name');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [mode]);

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text,
        sender: 'bot',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 800);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setInputText('');
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: userMsg,
      sender: 'user',
      timestamp: new Date()
    }]);

    // Logic Tree
    if (mode === 'login') {
      handleLoginFlow(userMsg);
    } else {
      handleSignupFlow(userMsg);
    }
  };

  const handleLoginFlow = (msg) => {
    if (step === 'email') {
      if (!msg.includes('@')) {
        addBotMessage("Hmm, that doesn't look like a valid email. 🤔 Please try again.");
        return;
      }
      setAuthData(prev => ({ ...prev, email: msg }));
      setStep('password');
      addBotMessage("Got it! ✓ Now, please enter your password.");
    } else if (step === 'password') {
      setStep('authenticating');
      addBotMessage("🔐 Authenticating your credentials...");
      // Simulate Backend call
      setTimeout(() => {
        addBotMessage("✅ Success! Welcome back to WiseTrek.");
        setTimeout(() => onSuccess({ name: "Traveler", email: authData.email }), 1000);
      }, 2000);
    }
  };

  const handleSignupFlow = (msg) => {
    if (step === 'name') {
      setAuthData(prev => ({ ...prev, name: msg }));
      setStep('email');
      addBotMessage(`Nice to meet you, ${msg}! 👋 What's your email address?`);
    } else if (step === 'email') {
      if (!msg.includes('@')) {
        addBotMessage("Please enter a valid email address.");
        return;
      }
      setAuthData(prev => ({ ...prev, email: msg }));
      setStep('password');
      addBotMessage("Perfect! Now create a secure password.");
    } else if (step === 'password') {
      setStep('authenticating');
      addBotMessage("🚀 Creating your profile...");
      setTimeout(() => {
        addBotMessage(`✅ Account created! Welcome aboard, ${authData.name}!`);
        setTimeout(() => onSuccess({ name: authData.name, email: authData.email }), 1000);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-none">
                {mode === 'login' ? 'Welcome Back' : 'Join WiseTrek'}
              </h2>
              <p className="text-[10px] text-white/70 uppercase tracking-widest mt-1">Auth Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {messages.map(m => <ChatMessage key={m.id} message={m} />)}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-none">
                <CircularProgress size={16} thickness={6} className="text-blue-500" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type={step === 'password' ? 'password' : 'text'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your reply here..."
              className="w-full bg-gray-100 border-none rounded-2xl px-5 py-4 pr-12 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <MessageSquare size={18} />
            </button>
          </form>
          
          <button 
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setMessages([]);
            }}
            className="w-full text-center mt-3 text-xs text-gray-400 hover:text-blue-600 transition-colors font-medium"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}