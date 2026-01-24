import User from '../models/User.js';
import Guide from '../models/guide.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { generateToken } from '../services/jwtService.js';

export const register = async (req, res) => {
  try {
    const { fullName, email, username, phoneNumber, password, role } = req.body;

    if (!fullName || !email || !username || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!['user', 'guide'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    let emailExists, usernameExists;

    if (role === 'user') {
      emailExists = await User.findOne({ email });
      usernameExists = await User.findOne({ username });
    } else {
      emailExists = await User.findOne({ email }); 
      usernameExists = await User.findOne({ username });
      const guideEmail = await Guide.findOne({ email });
      const guideUsername = await Guide.findOne({ username });
      if (guideEmail) emailExists = guideEmail;
      if (guideUsername) usernameExists = guideUsername;
    }

    if (emailExists) return res.status(400).json({ success: false, message: 'Email already exists' });
    if (usernameExists) return res.status(400).json({ success: false, message: 'Username already exists' });

    const hashedPassword = await hashPassword(password);


    if (role === 'guide') {
      const newUser = new User({
        fullName,
        email,
        username,
        phoneNumber,
        password: hashedPassword,
        role,
      });
      await newUser.save();

      const newGuide = new Guide({
        userId: newUser._id,
        experience: 0,
        languages: [],
        bio: '',
        rating: 0,
        isAvailable: true,
      });
      await newGuide.save();

      const token = generateToken(newUser);
      const { password: _, ...userWithoutPassword } = newUser.toObject();

      return res.json({ success: true, data: { user: userWithoutPassword, guide: newGuide }, token });
    }

    if (role === 'user') {
      const newUser = new User({
        fullName,
        email,
        username,
        phoneNumber,
        password: hashedPassword,
        role,
      });
      await newUser.save();

      const token = generateToken(newUser);
      const { password: _, ...userWithoutPassword } = newUser.toObject();

      return res.json({ success: true, data: userWithoutPassword, token });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });


    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

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
