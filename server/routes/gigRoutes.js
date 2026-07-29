import express from 'express';
import { 
  createGig, 
  updateGigProgress, 
  submitProposal, 
  getMyApplications, 
  getOpenGigs 
} from '../controllers/gigController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; 
import upload from '../middleware/uploadMiddleware.js'; 

const router = express.Router();

router.get('/', verifyToken, getOpenGigs);
router.post('/', verifyToken, upload.array('documents', 5), createGig);
router.patch('/:id/progress', verifyToken, updateGigProgress);
router.post('/:id/proposals', verifyToken, submitProposal);
router.get('/applications/me', verifyToken, getMyApplications);

export default router;