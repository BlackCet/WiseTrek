import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { Container } from '@mui/material';
import Weather from './components/Weather';
import TravelPlanner from './components/TravelPlanner';
import './index.css';

function App() {
  return (
    <Router>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/planner" element={<TravelPlanner />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;