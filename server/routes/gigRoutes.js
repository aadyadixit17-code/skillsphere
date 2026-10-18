import express from 'express';
import { createGig } from '../controllers/gigController.js';
import {
  matchFreelancersForGig,
  getPersonalizedRecommendations,
  getTrendingSkills,
} from '../controllers/matchingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('Client', 'Admin'), createGig);
router.get('/recommendations/me', protect, authorize('Freelancer'), getPersonalizedRecommendations);
router.get('/trending-skills', getTrendingSkills);
router.get('/:id/matches', protect, matchFreelancersForGig);

export default router;