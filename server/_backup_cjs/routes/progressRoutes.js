const express = require('express');
const router = express.Router();
const {
  createTracker,
  getTrackerByGig,
  updateProgress
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createTracker);
router.get('/:gigId', protect, getTrackerByGig);
router.put('/:id', protect, authorize('Freelancer'), updateProgress);

export default router;