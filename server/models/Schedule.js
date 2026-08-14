const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // 1. Availability slots
  availableSlots: [{
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g., "10:00 AM"
    endTime: { type: String, required: true },   // e.g., "12:00 PM"
    isBooked: { type: Boolean, default: false }
  }],

  // 2. Booking system records
  bookings: [{
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    startTime: String,
    endTime: String,
    status: { type: String, enum: ['Confirmed', 'Cancelled', 'Completed'], default: 'Confirmed' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);