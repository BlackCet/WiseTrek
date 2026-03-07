import express from 'express';
import { getTravelPlan } from '../controllers/plannerController.js';

const router = express.Router();

router.get("/", getTravelPlan);

export default router;