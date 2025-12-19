import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { Container } from '@mui/material';
import AiResponse from './pages/AiResponse';
function App() {
  return (
    <Router>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ai-planner" element={<AiResponse />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;