import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Register
export const register = async (req, res) => {
  try {
    const { fullName, email, username, phoneNumber, password, role } = req.body;

    if (!role || !['user', 'guide'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists) return res.json({ success: false, message: 'Email already exists' });
    if (usernameExists) return res.json({ success: false, message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      username,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return res.json({ success: true, data: userWithoutPassword });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({ 
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername }
      ]
    });

    if (!user) return res.json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: 'Wrong password' });

    const { password: _, ...userWithoutPassword } = user.toObject();
    return res.json({ success: true, data: userWithoutPassword });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
