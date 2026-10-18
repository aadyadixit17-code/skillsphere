import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import Message from './models/Message.js';

// Initialize passport configuration
import './config/passport.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import gigRoutes from './routes/gigRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import schedulerRoutes from './routes/schedulerRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import freelancerAnalyticsRoutes from './routes/freelancerAnalyticsRoutes.js';

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

// Allowed origin for CORS / Socket.IO.
// In a single-service deployment the frontend and API share one origin,
// so this mostly matters for local development or a split deployment.
// Set CLIENT_URL (e.g. https://your-app.onrender.com) to restrict it.
const corsOrigin = process.env.CLIENT_URL || '*';

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT'],
  },
});

// Middleware
app.use(express.json());
app.use(cors({ origin: corsOrigin }));
app.use(passport.initialize());

// Ensure 'uploads' folder exists (always relative to this file, not the working directory)
// Note: on Render's free tier the disk is temporary, so uploaded files are lost on redeploy/restart.
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Health check (handy for Render)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/scheduler', schedulerRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/freelancer-analytics', freelancerAnalyticsRoutes);

// Unknown API routes return JSON 404 (instead of falling through to the React app)
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

if (isProduction) {
  // Serve the built React frontend
  // Use 'dist' instead of 'build' if the client uses Vite
  const buildPath = path.join(__dirname, '../client/build');
  app.use(express.static(buildPath));
  app.use((req, res) => res.sendFile(path.join(buildPath, 'index.html')));
} else {
  // Root endpoint for local development
  app.get('/', (req, res) => {
    res.send('SkillSphere API is running...');
  });
}

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
    try {
      await Message.updateMany(
        { sender: senderId, recipient: recipientId, isRead: false },
        { $set: { isRead: true } }
      );
      io.to(senderId).emit('messages_read', { readerId: recipientId });
    } catch (error) {
      console.error('Mark read error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});