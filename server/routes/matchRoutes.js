const express = require('express');
const router = express.Router();
const { matchFreelancersForJob } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:jobId', protect, matchFreelancersForJob);

module.exports = router;