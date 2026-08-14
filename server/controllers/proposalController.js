const Proposal = require('../models/Proposal');
const Gig = require('../models/Gig');

// @desc Submit a proposal for a gig
// @route POST /api/proposals/:gigId
// @access Private (Freelancer Only)
exports.submitProposal = async (req, res) => {
  try {
    const { description, bidAmount, estimatedTime } = req.body;
    const gig = await Gig.findById(req.params.gigId);
    
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    // Check if freelancer already submitted a proposal for this gig
    const existingProposal = await Proposal.findOne({
      gig: req.params.gigId,
      freelancer: req.user._id
    });

    if (existingProposal) {
      return res.status(400).json({ message: 'You have already submitted a proposal for this gig' });
    }

    const proposal = await Proposal.create({
      gig: req.params.gigId,
      freelancer: req.user._id,
      description,
      bidAmount,
      estimatedTime
    });

    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get proposals for a specific gig (Client view) or freelancer's sent proposals
// @route GET /api/proposals/gig/:gigId or /api/proposals/me
// @access Private
exports.getProposalsForGig = async (req, res) => {
  try {
    const proposals = await Proposal.find({ gig: req.params.gigId }).populate('freelancer', 'name email role');
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user._id }).populate('gig', 'title budget');
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Client manages proposal (Accept, Reject, Negotiate)
// @route PUT /api/proposals/:id/status
// @access Private (Client Only)
exports.updateProposalStatus = async (req, res) => {
  try {
    const { status, counterAmount, counterMessage } = req.body; 
    // status can be 'Accepted', 'Rejected', 'Negotiating'
    
    const proposal = await Proposal.findById(req.params.id).populate('gig');
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    proposal.status = status || proposal.status;

    if (status === 'Negotiating') {
      proposal.clientCounterOffer = {
        amount: counterAmount,
        message: counterMessage
      };
    }

    await proposal.save();
    res.json({ message: `Proposal status updated to ${proposal.status}`, proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};