import express from 'express';
import cors from 'cors';
import passport from 'passport';
import 'dotenv/config';

// NOTE: In ES Modules, you MUST include the .js extension for local files
import './config/passport.js'; 
import connectDB from './db.js';

// Route Imports
import eventRoutes from './routes/eventRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import plannerRoutes from './routes/plannerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';

const app = express();

// Initialize Database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', eventRoutes);
app.use('/api/ai', aiRoutes); // This handles all /api/ai/... routes
app.use("/api/weather", weatherRoutes);
app.use("/api/planner", plannerRoutes);
app.use('/api/users', userRoutes);
app.use("/api/hotels", hotelRoutes);
app.get('/api/test', (req, res) => {
    res.json({ status: "Station Master Server is healthy and running 🚂" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});