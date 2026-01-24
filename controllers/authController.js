import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { generateToken } from '../services/jwtService.js';
import Guide from '../models/guide.js';

// =================== REGISTER ===================
export const register = async (req, res) => {
  try {
    const { fullName, email, username, phoneNumber, password, role } = req.body;

    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists) return res.status(400).json({ success: false, message: 'Email already exists' });
    if (usernameExists) return res.status(400).json({ success: false, message: 'Username already exists' });

    const hashedPassword = await hashPassword(password);

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

    res.json({ success: true, data: userWithoutPassword, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =================== LOGIN (USER OR GUIDE) ===================
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
