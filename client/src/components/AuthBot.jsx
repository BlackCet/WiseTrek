import React, { useState, useEffect, useRef } from 'react';
import { X, User, MessageSquare, Chrome } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export function AuthBot({ onClose, onSuccess, initialMode = 'login' }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [step, setStep] = useState('welcome');
  const [authData, setAuthData] = useState({});
  
  // Ref to prevent double-greeting in React Strict Mode
  const hasGreeted = useRef(false);

  useEffect(() => {
    // Reset state when mode changes
    setMessages([]);
    hasGreeted.current = false;
    
    const timer = setTimeout(() => {
      if (!hasGreeted.current) {
        if (mode === 'login') {
          addBotMessage("👋 Welcome back! Please enter your email to sign in.");
          setStep('email');
        } else {
          addBotMessage("🎉 Let's get started! What's your full name?");
          setStep('name');
        }
        hasGreeted.current = true;
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [mode]);

  const addBotMessage = (text) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(p => [...p, { id: Date.now(), text, sender: 'bot', timestamp: new Date() }]);
      setIsTyping(false);
    }, 600);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const val = inputText.trim();
    if (!val || isTyping) return;

    setInputText('');
    setMessages(p => [...p, { id: Date.now(), text: val, sender: 'user', timestamp: new Date() }]);

    try {
      if (mode === 'login') {
        if (step === 'email') {
          setAuthData({ emailOrMobile: val });
          setStep('password');
          addBotMessage("Got it! ✓ Now enter your password.");
        } else if (step === 'password') {
          setIsTyping(true);
          const res = await axios.post(`${API_URL}/login`, { 
            emailOrMobile: authData.emailOrMobile, 
            password: val 
          });
          addBotMessage("✅ Login successful! Redirecting...");
          setTimeout(() => onSuccess(res.data), 1000);
        }
      } else {
        // Signup Flow
        if (step === 'name') {
          setAuthData({ name: val });
          setStep('email');
          addBotMessage(`Hi ${val}! 👋 What's your email address?`);
        } else if (step === 'email') {
          setAuthData(p => ({ ...p, email: val }));
          setStep('password');
          addBotMessage("Perfect! Now create a secure password.");
        } else if (step === 'password') {
          setIsTyping(true);
          const res = await axios.post(`${API_URL}/signup`, { 
            name: authData.name, 
            email: authData.email, 
            password: val 
          });
          addBotMessage(`🚀 Account created! Welcome aboard, ${authData.name}!`);
          setTimeout(() => onSuccess(res.data), 1000);
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Something went wrong.";
      addBotMessage(`❌ ${errorMsg}`);
      // Keep them at the current step to try again
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-none">
                {mode === 'login' ? 'Welcome Back' : 'Join WiseTrek'}
              </h2>
              <p className="text-[10px] uppercase tracking-widest mt-1 opacity-70">Auth Assistant</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={24} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
              <div className={`p-4 rounded-2xl max-w-[85%] shadow-sm ${
                m.sender === 'bot' 
                ? 'bg-white text-gray-800 rounded-bl-none' 
                : 'bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
              }`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm">
                <CircularProgress size={16} thickness={6} className="text-blue-500" />
              </div>
            </div>
          )}
        </div>

        {/* Footer / Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="relative mb-3">
            <input 
              type={step === 'password' ? 'password' : 'text'}
              className="w-full bg-gray-100 p-4 rounded-2xl outline-none text-sm focus:ring-2 focus:ring-blue-500 transition-all" 
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Type your reply here..."
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <MessageSquare size={18} />
            </button>
          </form>

          {/* SOCIAL LOGIN */}
          <button 
            onClick={() => window.location.href = `${API_URL}/google`}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors mb-3"
          >
            <Chrome size={18} className="text-blue-500" /> 
            Continue with Google
          </button>

          {/* MODE TOGGLE (The part I added back) */}
          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="w-full text-center text-xs text-gray-400 hover:text-blue-600 font-medium transition-colors"
          >
            {mode === 'login' 
              ? "Don't have an account? Create one" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}