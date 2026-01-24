import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { generateToken } from '../services/jwtService.js';
import Guide from '../models/guide.js';
// =================== LOGIN GUIDE ===================
export const loginGuide = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    if (user.role !== 'guide')
      return res.status(403).json({ success: false, message: 'Not authorized as guide' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Wrong password' });

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({ success: true, data: userWithoutPassword, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =================== GUIDE PROFILE ===================
export const getGuideProfile = async (req, res) => {
  try {
    const guide = await Guide.findOne({ userId: req.user._id }).populate('userId', '-password');
    if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });

    res.json({ success: true, data: guide });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// =================== UPDATE GUIDE PROFILE ===================
export const updateGuideProfile = async (req, res) => {
  try {
    const { bio, languages } = req.body;
    const guide = await Guide.findOne({ userId: req.user._id });
    if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });

    guide.bio = bio || guide.bio;
    guide.languages = languages || guide.languages;
    await guide.save();

    res.json({ success: true, data: guide });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
