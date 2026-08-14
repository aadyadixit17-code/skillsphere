const mongoose = require('mongoose');

const progressTrackerSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  completionPercentage: { type: Number, default: 0, min: 0, max: 100 },
  fileUploads: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  progressLogs: [{
    note: String,
    date: { type: Date, default: Date.now }
  }],
  deadline: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ProgressTracker', progressTrackerSchema);