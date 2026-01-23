export const validateRegister = (req, res, next) => {
  const { fullName, email, username, password, role } = req.body;
  if (!fullName || !email || !username || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  if (!['user', 'guide'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }
  next();
};
