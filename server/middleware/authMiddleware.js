const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: function() { return !this.googleId; } },
  role: { type: String, enum: ['Client', 'Freelancer', 'Admin'], default: 'Client' },
  
  // Feature 4: Email Verification fields
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpire: Date,

  // Feature 3: Google OAuth field
  googleId: { type: String },

  // Feature 5: Password Reset fields
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Feature 6: Two-Factor Authentication fields
  twoFactorSecret: { type: String },
  isTwoFactorEnabled: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);