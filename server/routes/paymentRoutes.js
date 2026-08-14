const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  releaseEscrow,
  refundPayment,
  getTransactionHistory
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create-intent', protect, authorize('Client'), createPaymentIntent);
router.put('/release/:id', protect, authorize('Client', 'Admin'), releaseEscrow);
router.post('/refund/:id', protect, authorize('Client', 'Admin'), refundPayment);
router.get('/history', protect, getTransactionHistory);

module.exports = router;