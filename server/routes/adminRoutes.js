const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  toggleUserSuspension,
  verifyFreelancer,
  approveGig,
  monitorPayments,
  getFraudAlerts,
  getAdminAnalytics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/users', protect, authorize('Admin'), getAllUsers);
router.put('/users/:id/suspend', protect, authorize('Admin'), toggleUserSuspension);
router.put('/freelancers/:userId/verify', protect, authorize('Admin'), verifyFreelancer);
router.put('/gigs/:id/approve', protect, authorize('Admin'), approveGig);
router.get('/payments', protect, authorize('Admin'), monitorPayments);
router.get('/fraud-alerts', protect, authorize('Admin'), getFraudAlerts);
router.get('/analytics', protect, authorize('Admin'), getAdminAnalytics);

export default router;