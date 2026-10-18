import express from 'express';
const router = express.Router();
import { setAvailabilitySlots, getFreelancerAvailability, bookSlot } from '../controllers/schedulerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.post('/slots', protect, authorize('Freelancer'), setAvailabilitySlots);
router.get('/:freelancerId', getFreelancerAvailability);
router.post('/book', protect, authorize('Client'), bookSlot);

export default router;