import express from 'express';
const router = express.Router();
import { getChatHistory, markAsRead } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/:userId', protect, getChatHistory);
router.put('/read/:senderId', protect, markAsRead);

export default router;