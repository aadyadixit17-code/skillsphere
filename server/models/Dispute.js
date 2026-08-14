const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Client or Freelancer
  against: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  evidenceUrls: [{ type: String }], // Uploaded evidence files/screenshots
  status: { 
    type: String, 
    enum: ['Open', 'Under Mediation', 'Resolved - Refunded', 'Resolved - Released'], 
    default: 'Open' 
  },
  adminNotes: { type: String },
  resolutionSummary: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);