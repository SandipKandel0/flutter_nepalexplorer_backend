import express from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} from '../controllers/notificationsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.get('/', authMiddleware, getNotifications);
router.get('/unread-count', authMiddleware, getUnreadCount);
router.post('/:id/read', authMiddleware, markNotificationAsRead);
router.post('/read-all', authMiddleware, markAllNotificationsAsRead);

export default router;
