import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  profilePicture: { type: String, default: null }, // URL to profile picture
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'guide'], default: 'user' }, // role toggle
}, { timestamps: true });

export default mongoose.model('User', userSchema);
