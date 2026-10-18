import express from 'express';
const router = express.Router();
import { createTracker, getTrackerByGig, updateProgress } from '../controllers/progressController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.post('/', protect, createTracker);
router.get('/:gigId', protect, getTrackerByGig);
router.put('/:id', protect, authorize('Freelancer'), updateProgress);

export default router;