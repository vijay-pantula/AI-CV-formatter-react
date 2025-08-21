// routes/cvRoutes.js
// Defines the API endpoints (routes) for CV processing.

const express = require('express');
const router = express.Router();

// Import the controller function that contains the logic
const { formatCvController } = require('../controllers/cvController.js');

// --- Route Definition ---
// Define a POST route at '/format'.
// When the frontend sends a POST request to '/api/cv/format',
// the 'formatCvController' function will be executed.
router.post('/format', formatCvController);

// Export the router so it can be used in server.js
module.exports = router;
