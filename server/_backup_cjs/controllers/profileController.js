const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc Get current freelancer profile
// @route GET /api/profiles/me
// @access Private
exports.getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email role');
    if (!profile) {
      // Auto-create blank profile if missing
      profile = await Profile.create({ user: req.user._id });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get profile by User ID (Public / Client view)
// @route GET /api/profiles/user/:userId
// @access Public
exports.getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', 'name email role');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Profile Details (Skills, Pricing, Experience, Availability, Certifications)
// @route PUT /api/profiles/me
// @access Private (Freelancer)
exports.updateProfile = async (req, res) => {
  try {
    const {
      bio,
      skills,
      portfolio,
      certifications,
      workExperience,
      availability,
      hourlyRate,
      minimumMilestoneRate
    } = req.body;

    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new Profile({ user: req.user._id });
    }

    if (bio !== undefined) profile.bio = bio;
    if (skills) profile.skills = skills;
    if (portfolio) profile.portfolio = portfolio;
    if (certifications) profile.certifications = certifications;
    if (workExperience) profile.workExperience = workExperience;
    if (availability) profile.availability = availability;
    if (hourlyRate !== undefined) profile.hourlyRate = hourlyRate;
    if (minimumMilestoneRate !== undefined) profile.minimumMilestoneRate = minimumMilestoneRate;

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Upload Resume Document
// @route POST /api/profiles/upload-resume
// @access Private (Freelancer)
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a file' });

    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) profile = new Profile({ user: req.user._id });

    profile.resumeUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    await profile.save();

    res.json({ message: 'Resume uploaded successfully', resumeUrl: profile.resumeUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update Verification Badge System (Admin function or system automatic trigger)
// @route PUT /api/profiles/:userId/verify-badge
// @access Private (Admin)
exports.updateVerificationBadge = async (req, res) => {
  try {
    const { isVerifiedBadge, badgeType } = req.body;

    let profile = await Profile.findOne({ user: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.isVerifiedBadge = isVerifiedBadge;
    profile.badgeType = badgeType || 'Verified Pro';
    await profile.save();

    res.json({ message: 'Badge status updated', profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};