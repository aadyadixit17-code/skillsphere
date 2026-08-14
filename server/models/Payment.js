const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  stripePaymentIntentId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Held in Escrow', 'Released', 'Refunded'], 
    default: 'Held in Escrow' 
  },
  milestoneTitle: { type: String, default: 'Full Project Payment' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);