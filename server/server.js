const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// const connectDB = require('./db');
// connectDB();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend! The server is up and running.' });
});

// const tripRoutes = require('./routes/trips');
// app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});