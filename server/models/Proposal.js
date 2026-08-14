const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  estimatedTime: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Negotiating', 'Rejected'], 
    default: 'Pending' 
  },
  clientCounterOffer: {
    amount: Number,
    message: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);