const Schedule = require('../models/Schedule');

// @desc Add or update availability slots for freelancer
// @route POST /api/scheduler/slots
// @access Private (Freelancer)
exports.setAvailabilitySlots = async (req, res) => {
  try {
    const { slots } = req.body; // Array of { date, startTime, endTime }

    let schedule = await Schedule.findOne({ freelancer: req.user._id });
    if (!schedule) {
      schedule = new Schedule({ freelancer: req.user._id, availableSlots: slots });
    } else {
      schedule.availableSlots.push(...slots);
    }

    await schedule.save();
    res.json({ message: 'Availability slots updated successfully', schedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get availability slots for a freelancer (Public / Client view)
// @route GET /api/scheduler/:freelancerId
// @access Public
exports.getFreelancerAvailability = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ freelancer: req.params.freelancerId });
    if (!schedule) return res.json({ availableSlots: [], bookings: [] });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Book an available slot (Client Booking System with Auto-Scheduling check)
// @route POST /api/scheduler/book
// @access Private (Client)
exports.bookSlot = async (req, res) => {
  try {
    const { freelancerId, slotId, date, startTime, endTime } = req.body;

    const schedule = await Schedule.findOne({ freelancer: freelancerId });
    if (!schedule) return res.status(404).json({ message: 'Freelancer schedule not found' });

    // Find and lock the slot
    const slot = schedule.availableSlots.id(slotId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: 'Selected slot is already booked or unavailable' });
    }

    slot.isBooked = true;

    // Add to bookings list (Automatic scheduling record)
    schedule.bookings.push({
      client: req.user._id,
      date: date || slot.date,
      startTime: startTime || slot.startTime,
      endTime: endTime || slot.endTime,
      status: 'Confirmed'
    });

    await schedule.save();
    res.status(201).json({ message: 'Slot booked successfully', schedule });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};