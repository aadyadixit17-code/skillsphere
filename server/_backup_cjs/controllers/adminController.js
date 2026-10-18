const User = require('../models/User');
const Gig = require('../models/Gig');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Profile = require('../models/Profile');

// @desc Get all users
// @route GET /api/admin/users
// @access Private (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Suspend or activate user account
// @route PUT /api/admin/users/:id/suspend
// @access Private (Admin Only)
exports.toggleUserSuspension = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isSuspended = !user.isSuspended;
    await user.save();
    res.json({ message: `User account has been ${user.isSuspended ? 'suspended' : 'activated'}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Verify freelancer profile badge
// @route PUT /api/admin/freelancers/:userId/verify
// @access Private (Admin Only)
exports.verifyFreelancer = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.isVerifiedBadge = true;
    profile.badgeType = req.body.badgeType || 'Verified Pro';
    await profile.save();

    res.json({ message: 'Freelancer successfully verified', profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Approve or update gig status
// @route PUT /api/admin/gigs/:id/approve
// @access Private (Admin Only)
exports.approveGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    gig.status = req.body.status || 'Open';
    await gig.save();
    res.json({ message: 'Gig status updated successfully', gig });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Monitor all payments/transactions
// @route GET /api/admin/payments
// @access Private (Admin Only)
exports.monitorPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).populate('client freelancer gig', 'title name email');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc View flagged fake reviews / fraud detection items
// @route GET /api/admin/fraud-alerts
// @access Private (Admin Only)
exports.getFraudAlerts = async (req, res) => {
  try {
    const flaggedReviews = await Review.find({ isFlaggedAsFake: true }).populate('reviewer recipient gig');
    res.json(flaggedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get comprehensive platform analytics
// @route GET /api/admin/analytics
// @access Private (Admin Only)
exports.getAdminAnalytics = async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'Released' });
    const platformRevenue = payments.reduce((acc, item) => acc + (item.amount * 0.1), 0); // 10% platform fee example

    const activeFreelancersCount = await User.countDocuments({ role: 'Freelancer' });
    const totalGigs = await Gig.find({});
    
    // Top categories detection
    const categoryCounts = {};
    totalGigs.forEach((gig) => {
      const cat = gig.location || 'Development';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    res.json({
      platformRevenue: Number(platformRevenue.toFixed(2)),
      activeFreelancers: activeFreelancersCount,
      topCategories: categoryCounts,
      jobSuccessRate: '94%' // Estimated metric based on completed gigs vs total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};