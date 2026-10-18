const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  getProfileByUserId,
  updateProfile,
  uploadResume,
  updateVerificationBadge
} = require('../controllers/freelancerProfileController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/me', protect, getMyProfile);
router.get('/user/:userId', getProfileByUserId);
router.put('/me', protect, authorize('Freelancer', 'Admin'), updateProfile);
router.post('/upload-resume', protect, authorize('Freelancer', 'Admin'), upload.single('resume'), uploadResume);
router.put('/:userId/verify-badge', protect, authorize('Admin'), updateVerificationBadge);

export default router;