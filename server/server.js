// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const districtRoutes = require('./routes/districtRoutes');

dotenv.config();

const app = express();

// --- CORRECTION AREA ---
// Use the CLIENT_URL environment variable from Render for the allowed origin.
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000'; // Fallback for local testing

const corsOptions = {
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true, // Important if you were using cookies/sessions (though less common in MERN)
};

app.use(cors(corsOptions));
// --- END CORRECTION AREA ---

app.use(express.json());

// Simple root route for Render health check
app.get('/', (req, res) => {
    res.send('MGNREGA API is running!');
});

app.use('/api', districtRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.log(err));