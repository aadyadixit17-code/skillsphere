import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  budget: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);
export default Job;