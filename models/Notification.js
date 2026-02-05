import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['accepted', 'rejected', 'new_request'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'BookingRequest' },
    guideName: { type: String }, // Name of the guide for easier display
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
