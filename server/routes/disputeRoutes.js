import express from 'express';
const router = express.Router();
import { createDispute, getAllDisputes, resolveDispute } from '../controllers/disputeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.post('/', protect, createDispute);
router.get('/', protect, authorize('Admin'), getAllDisputes);
router.put('/:id/resolve', protect, authorize('Admin'), resolveDispute);

export default router;