import mongoose from 'mongoose';

const guideSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bio: { type: String, trim: true },
    languages: [{ type: String }],
    experience: { type: Number }, // years of experience
    profilePicture: { type: String, default: null }, // URL to profile picture
    availability: { type: Boolean, default: true },
  },
  { collection: 'guides', timestamps: true }
);

export default mongoose.model('Guide', guideSchema);
