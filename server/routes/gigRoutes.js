const express = require('express');
const router = express.Router();
const {
  createGig,
  matchFreelancersForGig,
  getPersonalizedRecommendations,
  getTrendingSkills,
} = require('../controllers/matchingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Client', 'Admin'), createGig);
router.get('/recommendations/me', protect, authorize('Freelancer'), getPersonalizedRecommendations);
router.get('/trending-skills', getTrendingSkills);
router.get('/:id/matches', protect, matchFreelancersForGig);

export default router;