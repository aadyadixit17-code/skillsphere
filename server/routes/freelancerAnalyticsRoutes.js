import express from 'express';
const router = express.Router();
import { getFreelancerAnalytics } from '../controllers/freelancerAnalyticsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.get('/', protect, authorize('Freelancer'), getFreelancerAnalytics);

export default router;