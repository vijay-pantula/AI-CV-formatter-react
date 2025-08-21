// server.js
// Main entry point for the Express server.

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // Import database connection

// Connect to MongoDB
connectDB();

const cvRoutes = require('./routes/cvRoutes');
const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---

// ** START: CORS Configuration Update **
// Configure CORS to specifically allow requests from your frontend's origin.
// This tells the server it's okay to accept requests from localhost:3000.
const corsOptions = {
  origin: 'http://localhost:3000', 
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
// ** END: CORS Configuration Update **

// Enable the Express app to parse JSON formatted request bodies
app.use(express.json());

// --- API Routes ---
// Mount the CV formatting routes under the '/api/cv' path
app.use('/api/cv', cvRoutes);

app.get('/', (req, res) => {
  res.send('AI CV Formatter Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
