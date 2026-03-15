import express from 'express';
import { getTripPlan, getStructuredTripPlan, modifyStructuredTripPlan } from '../controllers/aiController.js'; 
import { handleChat } from '../controllers/chatController.js'; 

const router = express.Router();

router.post('/plan-trip', getTripPlan);
router.post('/plan-trip-structured', getStructuredTripPlan);
router.post('/modify-trip', modifyStructuredTripPlan);
router.post('/chat', handleChat);

export default router;