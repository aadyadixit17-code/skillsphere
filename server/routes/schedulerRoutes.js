const express = require('express');
const router = express.Router();
const {
  setAvailabilitySlots,
  getFreelancerAvailability,
  bookSlot
} = require('../controllers/schedulerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/slots', protect, authorize('Freelancer'), setAvailabilitySlots);
router.get('/:freelancerId', getFreelancerAvailability);
router.post('/book', protect, authorize('Client'), bookSlot);

module.exports = router;