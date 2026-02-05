import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { generateToken } from '../services/jwtService.js';
import Guide from '../models/guide.js';

//Login
export const loginGuide = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    if (user.role !== 'guide') return res.status(403).json({ success: false, message: 'Not authorized as guide' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Wrong password' });

    // Fetch guide profile linked to this user
    let guide = await Guide.findOne({ userId: user._id });
    
    // If guide profile doesn't exist, create one
    if (!guide) {
      guide = new Guide({
        userId: user._id,
        bio: '',
        languages: [],
        experience: 0,
      });
      await guide.save();
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({ success: true, data: { user: userWithoutPassword, guide }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// getGuide
export const getGuideProfile = async (req, res) => {
  try {
    let guide = await Guide.findOne({ userId: req.user.id }).populate('userId', '-password');
    
    // If guide profile doesn't exist, create one
    if (!guide) {
      const newGuide = new Guide({
        userId: req.user.id,
        bio: '',
        languages: [],
        experience: 0,
      });
      await newGuide.save();
      // Fetch and populate the newly created guide
      guide = await Guide.findOne({ userId: req.user.id }).populate('userId', '-password');
    }

    res.json({ success: true, data: { guide, user: guide.userId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// update profile
export const updateGuideProfile = async (req, res) => {
  try {
    const { bio, languages, experience } = req.body;
    const guide = await Guide.findOne({ userId: req.user.id });
    if (!guide) return res.status(404).json({ success: false, message: 'Guide not found' });

    // Update guide fields
    guide.bio = bio || guide.bio;
    guide.languages = languages ? (typeof languages === 'string' ? languages.split(',').map(l => l.trim()) : languages) : guide.languages;
    guide.experience = experience ? parseInt(experience) : guide.experience;

    // Handle file upload
    if (req.file) {
      guide.profilePicture = `/uploads/${req.file.filename}`;
    }

    await guide.save();

    // Return updated guide with user info
    const populatedGuide = await guide.populate('userId', '-password');
    res.json({ success: true, data: { guide: populatedGuide, user: populatedGuide.userId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
