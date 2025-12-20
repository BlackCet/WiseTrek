const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db'); // Import the DB function
const eventRoutes = require('./routes/eventRoutes');
const aiRoutes = require('./routes/aiRoutes');
const weatherRoutes = require("./routes/weatherRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const app = express();

// Initialize Database
connectDB();

// Middleware
app.use(cors()); 
app.use(express.json());

// Routes
app.use('/api', eventRoutes);
app.use('/api/ai', aiRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/planner", plannerRoutes);
app.get('/api/test', (req, res) => {
  res.json({ status: "Server is healthy and running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
