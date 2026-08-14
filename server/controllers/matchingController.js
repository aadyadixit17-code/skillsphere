const Gig = require('../models/Gig');
const User = require('../models/User');
const axios = require('axios');

// Helper to compute text similarity using Hugging Face free feature-extraction API
async function getHuggingFaceSimilarity(text1, text2) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
      { inputs: { source_sentence: text1, sentences: [text2] } },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY || 'hf_dummy_token'}` } }
    );
    return response.data[0] || 0.5;
  } catch (error) {
    // Fallback basic matching if token or API is bypassed
    const set1 = new Set(text1.toLowerCase().split(' '));
    const set2 = new Set(text2.toLowerCase().split(' '));
    let intersection = [...set1].filter(x => set2.has(x)).length;
    return intersection / Math.max(set1.size, set2.size, 1);
  }
}

// @desc Post a new gig
// @route POST /api/gigs
// @access Private (Client Only)
exports.createGig = async (req, res) => {
  try {
    const { title, description, skillsRequired, budget, location } = req.body;
    const gig = await Gig.create({
      title,
      description,
      skillsRequired,
      budget,
      location,
      client: req.user._id,
    });
    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get AI-powered matched freelancers for a gig
// @route GET /api/gigs/:id/matches
// @access Private
exports.matchFreelancersForGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    const freelancers = await User.find({ role: 'Freelancer' });

    const scoredFreelancers = await Promise.all(
      freelancers.map(async (freelancer) => {
        // Evaluate skill similarity using description/skills
        const freelancerProfileText = freelancer.skills ? freelancer.skills.join(' ') : 'developer javascript react node';
        const gigText = gig.skillsRequired.join(' ') + ' ' + gig.description;
        
        const score = await getHuggingFaceSimilarity(gigText, freelancerProfileText);

        return {
          _id: freelancer._id,
          name: freelancer.name,
          email: freelancer.email,
          matchScore: Math.round(score * 100),
        };
      })
    );

    // Sort by highest match score
    scoredFreelancers.sort((a, b) => b.matchScore - a.matchScore);
    res.json(scoredFreelancers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    const freelancer = await User.findById(req.user._id);
    const freelancerSkills = freelancer.skills || ['javascript', 'react', 'node'];

    const gigs = await Gig.find({ status: 'Open' });

    const recommendedGigs = gigs.map((gig) => {
      // Calculate matching score based on overlapping skills
      const matchingSkills = gig.skillsRequired.filter((skill) =>
        freelancerSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      );
      const score = Math.round((matchingSkills.length / Math.max(gig.skillsRequired.length, 1)) * 100);

      return {
        _id: gig._id,
        title: gig.title,
        description: gig.description,
        budget: gig.budget,
        skillsRequired: gig.skillsRequired,
        matchScore: score,
      };
    });

    // Sort by highest match score
    recommendedGigs.sort((a, b) => b.matchScore - a.matchScore);
    res.json(recommendedGigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Detect trending skills across all open gigs
// @route GET /api/gigs/trending-skills
// @access Public / Private
exports.getTrendingSkills = async (req, res) => {
  try {
    const gigs = await Gig.find({});
    const skillCounts = {};

    gigs.forEach((gig) => {
      gig.skillsRequired.forEach((skill) => {
        const formattedSkill = skill.trim().toLowerCase();
        skillCounts[formattedSkill] = (skillCounts[formattedSkill] || 0) + 1;
      });
    });

    // Sort skills by frequency
    const sortedSkills = Object.keys(skillCounts)
      .map((skill) => ({ skill, count: skillCounts[skill] }))
      .sort((a, b) => b.count - a.count);

    res.json(sortedSkills.slice(0, 10)); // Top 10 trending skills
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const express = require('express');
const router = express.Router();
const {
  createGig,
  matchFreelancersForGig,
  getPersonalizedRecommendations,
  getTrendingSkills,
} = require('../controllers/matchingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Client', 'Admin'), createGig);
router.get('/recommendations/me', protect, authorize('Freelancer'), getPersonalizedRecommendations);
router.get('/trending-skills', getTrendingSkills);
router.get('/:id/matches', protect, matchFreelancersForGig);

module.exports = router;