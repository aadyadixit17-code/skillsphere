const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getProfile, updateProfile, uploadResume, verifyProfile, updateAvailability, updatePricing } = require('../controllers/profileController');

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.post('/resume', protect, upload.single('resume'), uploadResume);
router.patch('/verify', protect, verifyProfile);
router.put('/availability', protect, updateAvailability);
router.put('/pricing', protect, updatePricing);

module.exports = router;