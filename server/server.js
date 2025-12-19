const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//routes
const weatherRoutes = require("./routes/weatherRoutes");
const plannerRoutes = require("./routes/plannerRoutes");

//routes use
app.use("/api/weather", weatherRoutes);
app.use("/api/planner", plannerRoutes);

// 🔹 MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Hello from the backend! The server is up and running.",
  });
});

// Routes (enable later)
// const tripRoutes = require("./routes/trips");
// app.use("/api/trips", tripRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
