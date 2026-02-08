import express from 'express';
import {
  createBookingRequest,
  getGuideRequests,
  updateRequestStatus,
} from '../controllers/requestController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/requests/create', authMiddleware, createBookingRequest);
router.get('/requests/guide', authMiddleware, getGuideRequests);
router.post('/requests/:id/status', authMiddleware, updateRequestStatus);

export default router;
