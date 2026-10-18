import express from 'express';
const router = express.Router();
import { getMyProfile, getProfileByUserId, updateProfile, uploadResume, updateVerificationBadge } from '../controllers/profileController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

router.get('/me', protect, getMyProfile);
router.get('/user/:userId', getProfileByUserId);
router.put('/me', protect, authorize('Freelancer', 'Admin'), updateProfile);
router.post('/upload-resume', protect, authorize('Freelancer', 'Admin'), upload.single('resume'), uploadResume);
router.put('/:userId/verify-badge', protect, authorize('Admin'), updateVerificationBadge);

export default router;