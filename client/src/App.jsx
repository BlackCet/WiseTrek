
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { Container } from '@mui/material';
import Weather from './components/Weather';
import TravelPlanner from './components/TravelPlanner';
import RoutePlanner from './components/RoutePlanner';
import { TravelProvider } from "./context/TravelContext";
import './index.css';

function App() {
  return (
    <TravelProvider>
      <Router>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/planner" element={<TravelPlanner />} />
            <Route path="/routePlanner" element={<RoutePlanner />} />
          </Routes>
        </Container>
      </Router>
    </TravelProvider>
  );
}

export default App;
