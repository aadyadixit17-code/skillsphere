const express = require('express');
const router = express.Router();
const {
  submitProposal,
  getProposalsForGig,
  getMyProposals,
  updateProposalStatus
} = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:gigId', protect, authorize('Freelancer'), submitProposal);
router.get('/gig/:gigId', protect, getProposalsForGig);
router.get('/me', protect, authorize('Freelancer'), getMyProposals);
router.put('/:id/status', protect, authorize('Client', 'Admin'), updateProposalStatus);

module.exports = router;