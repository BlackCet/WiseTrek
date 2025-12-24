import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import HomePage from './pages/HomePage';
import AiResponse from './pages/AiResponse';
import ChatBot from './components/ChatBot';
import ManualPlanner from './pages/ManualPlanner';
import OAuthSuccess from './components/OAuthSuccess';
function App() {
  return (
    <Router>
      <Box 
        className="min-h-screen bg-background text-foreground transition-colors duration-300"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative' // Added to ensure children anchor correctly
        }}
      >
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ai-planner" element={<AiResponse />} />
            <Route path="/manual-planner" element={<ManualPlanner />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
          </Routes>
        </main>

        {/* This stays outside the main flow */}
        <ChatBot />
      </Box>
    </Router>
  );
}

export default App;