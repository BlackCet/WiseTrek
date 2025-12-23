
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// 1. Middlewares
app.use(cors()); 
app.use(express.json());

// 2. Import Route Files
const weatherRoutes = require("./routes/weatherRoutes");
const plannerRoutes = require("./routes/plannerRoutes");

// 3. Use Routes
app.use("/api/weather", weatherRoutes);
app.use("/api/planner", plannerRoutes); 

// 4. Critical Key Check
// This logs a warning if your SerpApi key is missing from .env
if (!process.env.SERP_API_KEY) {
    console.warn("⚠️ WARNING: SERP_API_KEY is not defined in .env file. Train search will fail.");
}

// 5. MongoDB connection
if (!process.env.MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not defined in .env file");
} else {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("✅ MongoDB connected successfully"))
      .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// 6. API Health Check / Test Route
app.get("/api/test", (req, res) => {
  res.json({
    status: "Active",
    message: "Server is up and running!",
    timestamp: new Date()
  });
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong on the server!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});