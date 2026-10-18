const Dispute = require('../models/Dispute');
const Payment = require('../models/Payment');

// @desc Raise a dispute request with evidence
// @route POST /api/disputes
// @access Private (Client or Freelancer)
exports.createDispute = async (req, res) => {
  try {
    const { paymentId, gigId, againstId, reason, evidenceUrls } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });

    const dispute = await Dispute.create({
      payment: paymentId,
      gig: gigId,
      raisedBy: req.user._id,
      against: againstId,
      reason,
      evidenceUrls: evidenceUrls || [],
      status: 'Open'
    });

    res.status(201).json(dispute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all disputes (Admin mediation view)
// @route GET /api/disputes
// @access Private (Admin Only)
exports.getAllDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find({}).populate('raisedBy against gig payment');
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Resolve dispute and update transaction status (Refund or Release)
// @route PUT /api/disputes/:id/resolve
// @access Private (Admin Only)
exports.resolveDispute = async (req, res) => {
  try {
    const { resolutionType, adminNotes, resolutionSummary } = req.body; 
    // resolutionType: 'Refund' or 'Release'

    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

    const payment = await Payment.findById(dispute.payment);
    if (!payment) return res.status(404).json({ message: 'Associated payment not found' });

    if (resolutionType === 'Refund') {
      payment.status = 'Refunded';
      dispute.status = 'Resolved - Refunded';
    } else if (resolutionType === 'Release') {
      payment.status = 'Released';
      dispute.status = 'Resolved - Released';
    } else {
      return res.status(400).json({ message: 'Invalid resolution type' });
    }

    await payment.save();
    dispute.adminNotes = adminNotes;
    dispute.resolutionSummary = resolutionSummary;
    await dispute.save();

    res.json({ message: 'Dispute resolved successfully', dispute, payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};