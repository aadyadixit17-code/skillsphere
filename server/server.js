require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const Message = require('./models/Message');

// Initialize passport configuration
require('./config/passport');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT']
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Ensure 'uploads' folder exists for resumes/portfolio files
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gigs', require('./routes/gigRoutes'));
app.use('/api/profiles', require('./routes/profileRoutes'));
app.use('/api/proposals', require('./routes/proposalRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.send('SkillSphere API is running...');
});

// Socket.IO Real-Time Chat & Collaboration
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Join personal room based on user ID
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  // Instant Messaging & File Sharing
  socket.on('send_message', async (data) => {
    const { sender, recipient, content, fileUrl } = data;
    try {
      const newMessage = await Message.create({ sender, recipient, content, fileUrl });
      io.to(recipient).emit('receive_message', newMessage);
      socket.emit('message_sent', newMessage);
    } catch (error) {
      console.error('Message save error:', error);
    }
  });

  // Typing Indicators
  socket.on('typing', (data) => {
    const { recipient, senderName } = data;
    io.to(recipient).emit('display_typing', { senderName });
  });

  socket.on('stop_typing', (data) => {
    const { recipient } = data;
    io.to(recipient).emit('hide_typing');
  });

  // Message Read Receipts
  socket.on('mark_read', async (data) => {
    const { senderId, recipientId } = data;
    await Message.updateMany({ sender: senderId, recipient: recipientId, isRead: false }, { $set: { isRead: true } });
    io.to(senderId).emit('messages_read', { readerId: recipientId });
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  app.use('/api/payments', require('./routes/paymentRoutes'));
  app.use('/api/reviews', require('./routes/reviewRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));
  app.use('/api/search', require('./routes/searchRoutes'));
  app.use('/api/notifications', require('./routes/notificationRoutes'));
  app.use('/api/scheduler', require('./routes/schedulerRoutes'));
  app.use('/api/disputes', require('./routes/disputeRoutes'));
  app.use('/api/progress', require('./routes/progressRoutes'));
  app.use('/api/freelancer-analytics', require('./routes/freelancerAnalyticsRoutes'));
});