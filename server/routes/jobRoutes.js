const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
    try {
        const { title, description, requiredSkills, budget, location } = req.body;
        const job = new Job({
            title,
            description,
            requiredSkills,
            budget,
            location,
            client: req.user.id
        });
        await job.save();
        res.status(201).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;