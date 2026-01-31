import express from 'express';
import { register, login,getProfile,updateProfile} from '../controllers/authController.js';
import { validateRegister } from '../validators/userValidator.js';
import { loginGuide } from '../controllers/guideController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', login);
router.post('/loginGuide', loginGuide);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

export default router;
