import express from 'express';
const router = express.Router();
import { submitProposal, getProposalsForGig, getMyProposals, updateProposalStatus } from '../controllers/proposalController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.post('/:gigId', protect, authorize('Freelancer'), submitProposal);
router.get('/gig/:gigId', protect, getProposalsForGig);
router.get('/me', protect, authorize('Freelancer'), getMyProposals);
router.put('/:id/status', protect, authorize('Client', 'Admin'), updateProposalStatus);

export default router;