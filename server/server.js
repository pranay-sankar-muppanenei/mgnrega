const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const districtRoutes = require('./routes/districtRoutes');

dotenv.config();

const app = express();

// --- START MANDATORY CORS FIX ---
// The CLIENT_URL environment variable from Render now serves as the BASE domain.
const productionOrigin = process.env.CLIENT_URL; // e.g., 'https://mgnrega.netlify.app'

// Regex to match the production domain OR any Netlify preview URL.
// The pattern looks for: https://[hash]--[site-name].netlify.app
const allowedOrigins = [
  productionOrigin,
  /^https:\/\/[a-z0-9-]+\-\-mgnrega\.netlify\.app$/, 
];

const corsOptions = {
    // This function checks the incoming request origin against our list/regex.
    origin: (origin, callback) => {
        // 1. Allow if there is no origin (e.g., direct API testing, internal calls)
        if (!origin) {
            return callback(null, true);
        }

        // 2. Check if the origin matches the production URL OR the dynamic regex pattern
        if (allowedOrigins.some(pattern => {
            if (pattern instanceof RegExp) {
                return pattern.test(origin); // Test against regex (for preview URLs)
            }
            return pattern.replace(/\/$/, '') === origin; // Test against string (for production URL)
        })) {
            callback(null, true); // Origin is allowed
        } else {
            // Origin is not allowed
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};

app.use(cors(corsOptions));
// --- END MANDATORY CORS FIX ---

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
