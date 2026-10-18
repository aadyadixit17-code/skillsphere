import express from 'express';
const router = express.Router();
import { searchGigs, searchFreelancers } from '../controllers/searchController.js';

router.get('/gigs', searchGigs);
router.get('/freelancers', searchFreelancers);

export default router;