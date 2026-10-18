const Notification = require('../models/Notification');
const sendEmail = require('./sendEmail'); // Uses your existing email utility from Module 1

const triggerNotification = async ({ io, recipientId, recipientEmail, title, message, type }) => {
  try {
    // 1. Save to Database
    const notification = await Notification.create({
      recipient: recipientId,
      title,
      message,
      type
    });

    // 2. Real-time Socket.IO Push (if connected)
    if (io) {
      io.to(recipientId.toString()).emit('new_notification', notification);
    }

    // 3. Email Notification Dispatch
    if (recipientEmail) {
      await sendEmail({
        email: recipientEmail,
        subject: `SkillSphere: ${title}`,
        message: `${message}\n\nLog in to your SkillSphere dashboard to view details.`
      });
    }

    return notification;
  } catch (error) {
    console.error('Notification trigger error:', error);
  }
};

module.exports = triggerNotification;