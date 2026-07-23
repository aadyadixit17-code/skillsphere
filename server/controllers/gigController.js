import Gig from '../models/Gig.js';


export const createGig = async (req, res) => {
  try {
    const { title, description, budgetRange, milestones, invitedFreelancers } = req.body;
    let documents = [];
    if (req.files && req.files.length > 0) {
      documents = req.files.map(file => file.path);
    }

    const gig = new Gig({
      client: req.user._id,
      title,
      description,
      budgetRange: JSON.parse(budgetRange || '{}'),
      milestones: JSON.parse(milestones || '[]'),
      documents,
      invitedFreelancers: JSON.parse(invitedFreelancers || '[]')
    });

    await gig.save();
    res.status(201).json({ success: true, gig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateGigProgress = async (req, res) => {
  try {
    const { progress, status, milestones } = req.body;
    const gig = await Gig.findOne({ _id: req.params.id, client: req.user._id });
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });

    if (progress !== undefined) gig.progress = progress;
    if (status) gig.status = status;
    if (milestones) gig.milestones = milestones;

    await gig.save();
    res.status(200).json({ success: true, gig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const submitProposal = async (req, res) => {
  try {
    const { coverLetter, bidAmount } = req.body;
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });

    gig.proposals.push({
      freelancer: req.user._id,
      coverLetter,
      bidAmount
    });

    await gig.save();
    res.status(200).json({ success: true, message: 'Proposal submitted successfully', gig });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getMyApplications = async (req, res) => {
  try {
    const gigs = await Gig.find({ 'proposals.freelancer': req.user._id });
    const applications = gigs.map(gig => {
      const proposal = gig.proposals.find(p => p.freelancer.toString() === req.user._id.toString());
      return {
        gigId: gig._id,
        title: gig.title,
        status: gig.status,
        proposalStatus: proposal.status,
        bidAmount: proposal.bidAmount,
        createdAt: proposal.createdAt
      };
    });
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getOpenGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ status: 'Open' }).populate('client', 'name email');
    res.status(200).json({ success: true, gigs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};