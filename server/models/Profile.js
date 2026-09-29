import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  
  // 1. Skills with proficiency level
  skills: [{
    name: { type: String, required: true },
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Intermediate' }
  }],

  // 2. Portfolio gallery
  portfolio: [{
    title: { type: String, required: true },
    description: String,
    projectUrl: String,
    imageUrl: String
  }],

  // 3. Resume upload
  resumeUrl: { type: String, default: '' },

  // 4. Certifications
  certifications: [{
    title: String,
    issuer: String,
    issueDate: Date,
    credentialUrl: String
  }],

  // 5. Work experience timeline
  workExperience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    isCurrent: { type: Boolean, default: false },
    description: String
  }],

  // 6. Availability calendar
  availability: {
    status: { type: String, enum: ['Available', 'Busy', 'On Vacation'], default: 'Available' },
    hoursPerWeek: { type: Number, default: 40 },
    nextAvailableDate: Date
  },

  // 7. Hourly & milestone pricing
  hourlyRate: { type: Number, default: 0 },
  minimumMilestoneRate: { type: Number, default: 0 },

  // 8. Verification badge system
  isVerifiedBadge: { type: Boolean, default: false },
  badgeType: { type: String, enum: ['None', 'Verified Pro', 'Top Rated'], default: 'None' }
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;