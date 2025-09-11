const express = require('express');
const { chatWithAI } = require('../controllers/aiController');
const router = express.Router();

// Route for AI chat interactions
router.post('/chat', chatWithAI);

module.exports = router;