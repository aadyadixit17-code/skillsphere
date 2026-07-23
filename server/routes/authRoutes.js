const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const passport = require('passport');
const { verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');

router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

router.post('/register', register);
router.post('/login', login);

module.exports = router;