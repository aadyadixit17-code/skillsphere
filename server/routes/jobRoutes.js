import express from 'express';
const router = express.Router();
import Job from '../models/Job.js';
import { protect } from '../middleware/authMiddleware.js';

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

export default router;