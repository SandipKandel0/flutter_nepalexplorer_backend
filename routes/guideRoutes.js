import express from 'express';
import { getGuideProfile, updateGuideProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getGuideProfile);
router.put('/profile', authMiddleware, updateGuideProfile);

export default router;
