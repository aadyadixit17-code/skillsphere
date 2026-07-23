const Job = require('../models/Job');
const Profile = require('../models/Profile');
const { getEmbedding, cosineSimilarity } = require('../services/aiMatchingService');

exports.matchFreelancersForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    const profiles = await Profile.find().populate('user', 'name email role');
    
    const jobText = `${job.title} ${job.description} ${job.requiredSkills.join(' ')}`;
    const jobEmbedding = await getEmbedding(jobText);

    const scoredFreelancers = await Promise.all(
      profiles.map(async (profile) => {
        const profileText = `${profile.title} ${profile.bio} ${profile.skills.join(' ')}`;
        const profileEmbedding = await getEmbedding(profileText);

        const similarityScore = cosineSimilarity(jobEmbedding, profileEmbedding);

        const locationMatch = profile.location && job.location && profile.location.toLowerCase() === job.location.toLowerCase() ? 1.1 : 1.0;

        const finalScore = similarityScore * locationMatch;

        return {
          profile,
          score: finalScore
        };
      })
    );

    scoredFreelancers.sort((a, b) => b.score - a.score);

    res.status(200).json({
      success: true,
      jobTitle: job.title,
      count: scoredFreelancers.length,
      matches: scoredFreelancers
    });
  } catch (error) {
    console.error('Matching error:', error);
    res.status(500).json({ success: false, error: 'AI Matching failed' });
  }
};