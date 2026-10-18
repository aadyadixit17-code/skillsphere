import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Only allow safe roles from the public form; prevent creating Admin directly via public form
    const safeRole = ['Client', 'Freelancer'].includes(role) ? role : 'Freelancer';

    // Create user (pass plain password; the model's pre('save') hook handles hashing)
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: safeRole,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email with normalization
    const user = await User.findOne({ email: (email || '').toLowerCase().trim() });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google Auth Callback
// @route   GET /api/auth/google/callback
// @access  Public
export const googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientUrl}/dashboard?token=${token}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send Email Verification
// @route   POST /api/auth/send-verification
// @access  Private
export const sendVerificationEmail = async (req, res) => {
  try {
    res.status(200).json({ message: 'Verification email functionality placeholder' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    res.status(200).json({ message: 'Email verified successfully placeholder' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    res.status(200).json({ message: 'Forgot password functionality placeholder' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    res.status(200).json({ message: 'Reset password functionality placeholder' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Setup 2FA
// @route   POST /api/auth/setup-2fa
// @access  Private
export const setup2FA = async (req, res) => {
  try {
    res.status(200).json({ message: '2FA setup placeholder' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify 2FA
// @route   POST /api/auth/verify-2fa
// @access  Private
export const verify2FA = async (req, res) => {
  try {
    res.status(200).json({ message: '2FA verification placeholder' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
