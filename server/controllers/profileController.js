const Profile = require('../models/Profile');

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'name email');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedData = req.body;
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      profile = new Profile({ user: req.user.id, ...updatedData });
    } else {
      Object.assign(profile, updatedData);
    }

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.resumeUrl = `/uploads/${req.file.filename}`;
    await profile.save();

    res.json({ message: 'Resume uploaded successfully', resumeUrl: profile.resumeUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyProfile = async (req, res) => {
  try {
    const { badgeType } = req.body;
    const profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.verificationBadge = {
      isVerified: true,
      badgeType: badgeType || 'Standard Verified'
    };

    await profile.save();
    res.json({ message: 'Profile verified successfully', verificationBadge: profile.verificationBadge });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { status, calendar } = req.body;
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (status) profile.availability.status = status;
    if (calendar && Array.isArray(calendar)) {
      profile.availability.calendar = calendar;
    }

    await profile.save();
    res.json({ message: 'Availability updated successfully', availability: profile.availability });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePricing = async (req, res) => {
  try {
    const { hourlyRate, milestonePricing } = req.body;
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (hourlyRate !== undefined) profile.pricing.hourlyRate = hourlyRate;
    if (milestonePricing !== undefined) profile.pricing.milestonePricing = milestonePricing;

    await profile.save();
    res.json({ message: 'Pricing updated successfully', pricing: profile.pricing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};