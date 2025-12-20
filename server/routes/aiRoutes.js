// routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/plan-trip', aiController.getTripPlan);

module.exports = router;