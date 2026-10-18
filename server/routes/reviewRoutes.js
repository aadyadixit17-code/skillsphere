import express from 'express';
const router = express.Router();
import { createReview, getReviewAnalytics } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.post('/', protect, authorize('Client'), createReview);
router.get('/analytics/:userId', getReviewAnalytics);

export default router;