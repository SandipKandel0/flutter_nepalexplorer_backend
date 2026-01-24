import express from 'express';
import { register, login} from '../controllers/authController.js';
import { validateRegister } from '../validators/userValidator.js';
import { loginGuide } from '../controllers/guideController.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', login);
router.post('/loginGuide', loginGuide);

export default router;
