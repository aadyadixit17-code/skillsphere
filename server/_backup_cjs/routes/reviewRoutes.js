const express = require('express');
const router = express.Router();
const { createReview, getReviewAnalytics } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Client'), createReview);
router.get('/analytics/:userId', getReviewAnalytics);

export default router;