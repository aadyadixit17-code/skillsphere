const express = require('express');
const router = express.Router();
const { getFreelancerAnalytics } = require('../controllers/freelancerAnalyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('Freelancer'), getFreelancerAnalytics);

export default router;