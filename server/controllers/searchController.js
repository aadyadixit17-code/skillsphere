const Gig = require('../models/Gig');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Review = require('../models/Review');

// @desc Advanced search for gigs with filters
// @route GET /api/search/gigs
// @access Public
exports.searchGigs = async (req, res) => {
  try {
    const { keyword, location, skills, minBudget, maxBudget } = req.query;
    let query = { status: 'Open' };

    // Location-based filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Skill-based filter
    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim());
      query.skillsRequired = { $in: skillArray.map(s => new RegExp(s, 'i')) };
    }

    // Price range filter
    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    // Keyword search in title or description
    if (keyword) {
      query.$or = [
        { title: { regex: keyword, options: 'i' } },
        { description: { regex: keyword, options: 'i' } }
      ];
    }

    const gigs = await Gig.find(query).populate('client', 'name email');
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Advanced search for freelancers with filters (Skills, Location, Rating, Experience)
// @route GET /api/search/freelancers
// @access Public
exports.searchFreelancers = async (req, res) => {
  try {
    const { skill, location, minRate, maxRate, minRating } = req.query;
    
    let profileQuery = {};

    // Location filter
    if (location) {
      profileQuery.location = { $regex: location, $options: 'i' };
    }

    // Skill filter
    if (skill) {
      profileQuery['skills.name'] = { $regex: skill, $options: 'i' };
    }

    // Price / Hourly rate filter
    if (minRate || maxRate) {
      profileQuery.hourlyRate = {};
      if (minRate) profileQuery.hourlyRate.$gte = Number(minRate);
      if (maxRate) profileQuery.hourlyRate.$lte = Number(maxRate);
    }

    let profiles = await Profile.find(profileQuery).populate('user', 'name email role');

    // Filter by rating if specified
    if (minRating) {
      const filteredProfiles = [];
      for (const profile of profiles) {
        const reviews = await Review.find({ recipient: profile.user._id, isFlaggedAsFake: false });
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        if (avgRating >= Number(minRating)) {
          filteredProfiles.push({ ...profile.toObject(), averageRating: avgRating.toFixed(1) });
        }
      }
      return res.json(filteredProfiles);
    }

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};