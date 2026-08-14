const Review = require('../models/Review');
const Payment = require('../models/Payment');

// @desc Submit a verified review with basic fraud detection
// @route POST /api/reviews
// @access Private (Client Only)
exports.createReview = async (req, res) => {
  try {
    const { gigId, paymentId, recipientId, rating, comment } = req.body;

    // 1. Verify review (Check if payment exists and was released/completed)
    const payment = await Payment.findById(paymentId);
    if (!payment || payment.status === 'Refunded') {
      return res.status(400).json({ message: 'Reviews can only be left for verified, successful transactions.' });
    }

    // 2. Fraud Detection for Fake Reviews (e.g., spam patterns, overly short repetitive text, extreme biased velocity)
    let isFlaggedAsFake = false;
    if (comment.length < 5 || /(test|asdf|good job)/i.test(comment)) {
      isFlaggedAsFake = true;
    }

    // 3. Weighted reputation score calculation (e.g., higher transaction amounts weigh heavier)
    const weightFactor = payment.amount > 500 ? 1.5 : 1.0;
    const weightedScore = rating * weightFactor;

    const review = await Review.create({
      gig: gigId,
      payment: paymentId,
      reviewer: req.user._id,
      recipient: recipientId,
      rating,
      comment,
      weightedScore,
      isVerified: true,
      isFlaggedAsFake
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get review analytics and weighted reputation score for a user
// @route GET /api/reviews/analytics/:userId
// @access Public
exports.getReviewAnalytics = async (req, res) => {
  try {
    const reviews = await Review.find({ recipient: req.params.userId, isFlaggedAsFake: false });

    if (reviews.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0, weightedReputation: 0, breakdown: {} });
    }

    let totalRating = 0;
    let totalWeightedScore = 0;
    let totalWeight = 0;
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach((rev) => {
      totalRating += rev.rating;
      totalWeightedScore += rev.weightedScore;
      totalWeight += (rev.weightedScore / rev.rating); // base weight factor
      breakdown[rev.rating] = (breakdown[rev.rating] || 0) + 1;
    });

    const averageRating = (totalRating / reviews.length).toFixed(1);
    const weightedReputation = (totalWeightedScore / Math.max(totalWeight, 1)).toFixed(2);

    res.json({
      averageRating: Number(averageRating),
      totalReviews: reviews.length,
      weightedReputation: Number(weightedReputation),
      breakdown,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};