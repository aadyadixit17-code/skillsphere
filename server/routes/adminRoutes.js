import express from 'express';
const router = express.Router();
import { getAllUsers, toggleUserSuspension, verifyFreelancer, approveGig, monitorPayments, getFraudAlerts, getAdminAnalytics } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.get('/users', protect, authorize('Admin'), getAllUsers);
router.put('/users/:id/suspend', protect, authorize('Admin'), toggleUserSuspension);
router.put('/freelancers/:userId/verify', protect, authorize('Admin'), verifyFreelancer);
router.put('/gigs/:id/approve', protect, authorize('Admin'), approveGig);
router.get('/payments', protect, authorize('Admin'), monitorPayments);
router.get('/fraud-alerts', protect, authorize('Admin'), getFraudAlerts);
router.get('/analytics', protect, authorize('Admin'), getAdminAnalytics);

export default router;