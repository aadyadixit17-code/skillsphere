const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    maxlength: 600
  },
  skills: [{
    name: { type: String, required: true },
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], required: true }
  }],
  location: {
    type: String,
    required: true
  },
  portfolioProjects: [
    {
      title: { type: String, required: true },
      description: { type: String },
      projectUrl: { type: String },
      imageUrl: { type: String }
    }
  ],
  portfolioGallery: [{
    title: { type: String },
    imageUrl: { type: String },
    projectUrl: { type: String }
  }],
  resumeUrl: { type: String },
  certifications: [{
    title: { type: String },
    issuedBy: { type: String },
    dateIssued: { type: Date }
  }],
  workExperience: [{
    company: { type: String },
    role: { type: String },
    from: { type: Date },
    to: { type: Date },
    description: { type: String }
  }],
  availability: {
    status: { type: String, enum: ['Available', 'Busy', 'Not Available'], default: 'Available' },
    calendar: [{ date: Date, available: Boolean }]
  },
  pricing: {
    hourlyRate: { type: Number, default: 0 },
    milestonePricing: { type: Boolean, default: false }
  },
  verificationBadge: {
    isVerified: { type: Boolean, default: false },
    badgeType: { type: String, default: 'Standard' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);