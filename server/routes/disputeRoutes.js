const express = require('express');
const router = express.Router();
const {
  createDispute,
  getAllDisputes,
  resolveDispute
} = require('../controllers/disputeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createDispute);
router.get('/', protect, authorize('Admin'), getAllDisputes);
router.put('/:id/resolve', protect, authorize('Admin'), resolveDispute);

export default router;