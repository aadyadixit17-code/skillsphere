const express = require('express');
const router = express.Router();
const { matchFreelancersForJob } = require('../controllers/matchingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:jobId', protect, matchFreelancersForJob);

export default router;