const express = require('express');
const cors = require('cors');
const passport = require('passport'); // New
require('dotenv').config();
require('./config/passport'); // Import Passport configuration

const connectDB = require('./db');
const eventRoutes = require('./routes/eventRoutes');
const aiRoutes = require('./routes/aiRoutes');
const weatherRoutes = require("./routes/weatherRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const authRoutes = require("./routes/authRoutes"); // New Auth Routes
const userRoutes = require('./routes/userRoutes');
const app = express();

// Initialize Database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow your frontend
    credentials: true
}));
app.use(express.json());

// Initialize Passport
app.use(passport.initialize()); // New

// Routes
app.use('/api/auth', authRoutes); // Auth endpoint
app.use('/api', eventRoutes);
app.use('/api/ai', aiRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/planner", plannerRoutes);
app.use('/api/users', userRoutes);

app.get('/api/test', (req, res) => {
  res.json({ status: "Server is healthy and running" });
});

const PORT = process.env.PORT || 5001; // Matches your .env
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
