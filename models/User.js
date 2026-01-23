import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'guide'], default: 'user' }, // ✅ role added
}, { timestamps: true });

export default mongoose.model('User', userSchema);
