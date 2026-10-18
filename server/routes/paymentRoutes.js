import express from 'express';
const router = express.Router();
import { createPaymentIntent, releaseEscrow, refundPayment, getTransactionHistory } from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.post('/create-intent', protect, authorize('Client'), createPaymentIntent);
router.put('/release/:id', protect, authorize('Client', 'Admin'), releaseEscrow);
router.post('/refund/:id', protect, authorize('Client', 'Admin'), refundPayment);
router.get('/history', protect, getTransactionHistory);

export default router;