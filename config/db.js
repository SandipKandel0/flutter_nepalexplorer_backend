import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(
      DATABASE_URL
    );
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
