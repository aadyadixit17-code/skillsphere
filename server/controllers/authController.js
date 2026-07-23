const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Client',
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    res.status(200).json({ message: 'Email verification endpoint placeholder' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    res.status(200).json({ message: 'Forgot password endpoint placeholder' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    res.status(200).json({ message: 'Reset password endpoint placeholder' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const setup2FA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ name: 'SkillSphere' });
    req.user.twoFactorSecret = secret.base32;
    await req.user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      res.status(200).json({ secret: secret.base32, qrCode: data_url });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const verified = speakeasy.totp.verify({
      secret: req.user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (verified) {
      req.user.isTwoFactorEnabled = true;
      await req.user.save();
      res.status(200).json({ message: '2FA Enabled Successfully' });
    } else {
      res.status(400).json({ message: 'Invalid 2FA token' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register: registerUser,
  login: loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  setup2FA,
  verify2FA,
};