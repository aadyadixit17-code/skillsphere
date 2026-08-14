const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  registerUser,
  loginUser,
  googleCallback,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
  setup2FA,
  verify2FA,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), googleCallback);

// Email Verification
router.get('/verify-email-send', protect, sendVerificationEmail);
router.get('/verify-email/:token', verifyEmail);

// Password Reset
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// 2FA Routes
router.get('/2fa/setup', protect, setup2FA);
router.post('/2fa/verify', protect, verify2FA);

module.exports = router;