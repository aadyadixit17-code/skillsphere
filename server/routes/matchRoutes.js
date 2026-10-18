import express from 'express';
const router = express.Router();
import { matchFreelancersForJob } from '../controllers/matchingController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/:jobId', protect, matchFreelancersForJob);

export default router;