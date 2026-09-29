import express from 'express';

import passport from 'passport';

const router = express.Router();
import { 
  registerUser, 
  loginUser, 
  googleCallback, 
  sendVerificationEmail, 
  verifyEmail, 
  forgotPassword, 
  resetPassword, 
  setup2FA, 
  verify2FA 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';



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

export default router;