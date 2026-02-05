import express from 'express';
import multer from 'multer';
import path from 'path';
import { register, login,getProfile,updateProfile} from '../controllers/authController.js';
import { validateRegister } from '../validators/userValidator.js';
import { loginGuide } from '../controllers/guideController.js';
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

router.post('/register', validateRegister, register);
router.post('/login', login);
router.post('/loginGuide', loginGuide);
router.get('/profile', authMiddleware, getProfile);
router.post('/profile', authMiddleware, upload.single('profilePicture'), updateProfile); 

export default router;
