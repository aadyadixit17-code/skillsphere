import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date },
  status: { type: String, enum: ['Pending', 'Completed', 'Approved'], default: 'Pending' }
});

const proposalSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const gigSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  budgetRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  milestones: [milestoneSchema],
  documents: [{ type: String }], // file paths or URLs
  invitedFreelancers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  proposals: [proposalSchema],
  status: { type: String, enum: ['Open', 'In Progress', 'Completed', 'Closed'], default: 'Open' },
  progress: { type: Number, default: 0 } // percentage 0-100
}, { timestamps: true });

export default mongoose.model('Gig', gigSchema);