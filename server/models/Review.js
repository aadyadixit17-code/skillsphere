const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true }, // Ensures verified review
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Client
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Freelancer
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  weightedScore: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: true }, // Verified via payment/completed contract
  isFlaggedAsFake: { type: Boolean, default: false } // Fraud detection flag
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);