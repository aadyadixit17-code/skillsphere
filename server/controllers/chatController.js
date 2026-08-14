const Message = require('../models/Message');

// @desc Get chat history between logged-in user and another user
// @route GET /api/chats/:userId
// @access Private
exports.getChatHistory = async (req, res) => {
  try {
    const user1 = req.user._id;
    const user2 = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Mark messages as read
// @route PUT /api/chats/read/:senderId
// @access Private
exports.markAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { sender: req.params.senderId, recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};