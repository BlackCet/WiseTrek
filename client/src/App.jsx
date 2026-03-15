import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import HomePage from './pages/HomePage';
import AiResponse from './pages/AiResponse';
import ChatBot from './components/ChatBot';
import ManualPlanner from './pages/ManualPlanner';
import OAuthSuccess from './components/OAuthSuccess';
import ProtectedRoute from './components/ProtectedRoute';

// 1. Import your auth hook
import { useAuth } from './context/AuthContext'; 

function AppContent() {
  // 2. Grab the user state
  const { user } = useAuth(); 

  return (
    <Box 
      className="min-h-screen bg-background text-foreground transition-colors duration-300"
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative' 
      }}
    >
      <main className="flex-grow">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* PROTECTED ROUTES */}
          <Route 
            path="/ai-planner" 
            element={
              <ProtectedRoute>
                <AiResponse />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manual-planner" 
            element={
              <ProtectedRoute>
                <ManualPlanner />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      {user && <ChatBot />}
    </Box>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;