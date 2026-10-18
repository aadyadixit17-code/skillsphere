const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const Payment = require('../models/Payment');

// @desc Create payment intent for Escrow/Milestone deposit
// @route POST /api/payments/create-intent
// @access Private (Client)
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, freelancerId, gigId, milestoneTitle } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: 'usd',
      metadata: { clientId: req.user._id.toString(), freelancerId, gigId }
    });

    // Save record as Held in Escrow
    const payment = await Payment.create({
      client: req.user._id,
      freelancer: freelancerId,
      gig: gigId,
      amount,
      stripePaymentIntentId: paymentIntent.id,
      milestoneTitle: milestoneTitle || 'Milestone Payment',
      status: 'Held in Escrow'
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Release Escrow funds to Freelancer (Automatic Payout simulation)
// @route PUT /api/payments/release/:id
// @access Private (Client or Admin)
exports.releaseEscrow = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });

    if (payment.status !== 'Held in Escrow') {
      return res.status(400).json({ message: 'Funds are not currently held in escrow' });
    }

    payment.status = 'Released';
    await payment.save();

    res.json({ message: 'Funds successfully released to freelancer!', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Refund management
// @route POST /api/payments/refund/:id
// @access Private (Client or Admin)
exports.refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });

    // Issue Stripe refund
    await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId
    });

    payment.status = 'Refunded';
    await payment.save();

    res.json({ message: 'Payment refunded successfully', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get transaction history for user
// @route GET /api/payments/history
// @access Private
exports.getTransactionHistory = async (req, res) => {
  try {
    const query = req.user.role === 'Client' ? { client: req.user._id } : { freelancer: req.user._id };
    const transactions = await Payment.find(query).populate('gig', 'title').sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};