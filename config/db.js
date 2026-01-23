import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

export const connectDB = async () => {
  try {
    // Use the environment variable
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
