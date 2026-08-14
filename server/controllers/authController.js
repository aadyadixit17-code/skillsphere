const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

// 1. Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role: role || 'Client' });
    if (user) {
      res.status(201).json({
        _id: user._id,
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

// 2. Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (user.isTwoFactorEnabled) {
        return res.json({ require2FA: true, userId: user._id });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Google OAuth Callback
exports.googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    res.redirect(`http://localhost:3000/dashboard?token=${token}&role=${req.user.role}&name=${encodeURIComponent(req.user.name)}`);
  } catch (error) {
    res.redirect('http://localhost:3000/?error=OAuthFailed');
  }
};

// 4. Email Verification
exports.sendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    user.verificationTokenExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const verificationUrl = `http://localhost:3000/verify-email/${verificationToken}`;
    await sendEmail({ email: user.email, subject: 'SkillSphere Email Verification', message: `Click link: ${verificationUrl}` });
    res.json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const verificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ verificationToken, verificationTokenExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Password Reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    await sendEmail({ email: user.email, subject: 'Password Reset', message: `Reset link: ${resetUrl}` });
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ message: 'Password reset success' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Two-Factor Authentication (2FA)
exports.setup2FA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ name: 'SkillSphere' });
    req.user.twoFactorSecret = secret.base32;
    await req.user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) return res.status(500).json({ message: 'QR Code generation error' });
      res.json({ secret: secret.base32, qrCodeUrl: data_url });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const verified = speakeasy.totp.verify({ secret: req.user.twoFactorSecret, encoding: 'base32', token });
    if (verified) {
      req.user.isTwoFactorEnabled = true;
      await req.user.save();
      res.json({ message: '2FA Enabled Successfully' });
    } else {
      res.status(400).json({ message: 'Invalid 2FA token' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};