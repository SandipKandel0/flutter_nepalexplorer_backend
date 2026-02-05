import express from 'express';
import multer from 'multer';
import path from 'path';
import { getGuideProfile, updateGuideProfile } from '../controllers/guideController.js';
import { getAllGuides } from '../controllers/requestController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for routes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Public route - get all guides
router.get('/list', getAllGuides);

router.get('/profile', authMiddleware, getGuideProfile);
router.post('/profile', authMiddleware, upload.single('profilePicture'), updateGuideProfile);

export default router;
