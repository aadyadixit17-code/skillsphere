const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: [{ type: String, required: true }],
  budget: { type: Number, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, default: 'Remote' },
  status: { type: String, enum: ['Open', 'In Progress', 'Completed'], default: 'Open' },
}, { timestamps: true });

module.exports = mongoose.model('Gig', gigSchema);