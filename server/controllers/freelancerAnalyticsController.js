const Proposal = require('../models/Proposal');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const Profile = require('../models/Profile');

// @desc Get comprehensive analytics for a freelancer dashboard
// @route GET /api/freelancer-analytics
// @access Private (Freelancer)
exports.getFreelancerAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Profile views
    const profile = await Profile.findOne({ user: userId });
    const profileViews = profile ? profile.views || 0 : 0;

    // 2. Gig applications / proposals count
    const applications = await Proposal.find({ freelancer: userId });
    const totalApplications = applications.length;

    // 3. Earnings statistics & Monthly revenue breakdown
    const payments = await Payment.find({ freelancer: userId, status: 'Released' });
    let totalEarnings = 0;
    const monthlyRevenue = {};

    payments.forEach(payment => {
      totalEarnings += payment.amount;
      const monthYear = new Date(payment.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + payment.amount;
    });

    // 4. Client feedback analytics (Reviews breakdown)
    const reviews = await Review.find({ recipient: userId, isFlaggedAsFake: false });
    let totalRating = 0;
    const feedbackBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach(review => {
      totalRating += review.rating;
      feedbackBreakdown[review.rating] = (feedbackBreakdown[review.rating] || 0) + 1;
    });

    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.json({
      profileViews,
      totalApplications,
      totalEarnings: Number(totalEarnings.toFixed(2)),
      monthlyRevenue,
      clientFeedback: {
        totalReviews: reviews.length,
        averageRating: Number(averageRating),
        breakdown: feedbackBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};