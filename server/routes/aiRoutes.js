import express from 'express';
import { getTripPlan } from '../controllers/aiController.js'; 
import { handleChat } from '../controllers/chatController.js'; 

const router = express.Router();

router.post('/plan-trip', getTripPlan);

router.post('/chat', handleChat);

export default router;