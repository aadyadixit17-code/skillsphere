const ProgressTracker = require('../models/ProgressTracker');

// @desc Initialize progress tracker for a gig
// @route POST /api/progress
// @access Private (Client / Freelancer)
exports.createTracker = async (req, res) => {
  try {
    const { gigId, freelancerId, clientId, deadline } = req.body;

    let tracker = await ProgressTracker.findOne({ gig: gigId });
    if (tracker) {
      return res.status(400).json({ message: 'Tracker already exists for this gig' });
    }

    tracker = await ProgressTracker.create({
      gig: gigId,
      freelancer: freelancerId,
      client: clientId,
      deadline,
      completionPercentage: 0
    });

    res.status(201).json(tracker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get progress tracker details for a gig
// @route GET /api/progress/:gigId
// @access Private
exports.getTrackerByGig = async (req, res) => {
  try {
    const tracker = await ProgressTracker.findOne({ gig: req.params.gigId }).populate('gig freelancer client');
    if (!tracker) return res.status(404).json({ message: 'Progress tracker not found' });
    res.json(tracker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update task completion percentage, add file upload, or add progress log
// @route PUT /api/progress/:id
// @access Private (Freelancer)
exports.updateProgress = async (req, res) => {
  try {
    const { completionPercentage, fileUpload, progressLog } = req.body;

    const tracker = await ProgressTracker.findById(req.params.id);
    if (!tracker) return res.status(404).json({ message: 'Progress tracker not found' });

    if (completionPercentage !== undefined) {
      tracker.completionPercentage = completionPercentage;
    }
    if (fileUpload) {
      tracker.fileUploads.push(fileUpload);
    }
    if (progressLog) {
      tracker.progressLogs.push({ note: progressLog });
    }

    await tracker.save();
    res.json({ message: 'Progress updated successfully', tracker });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};