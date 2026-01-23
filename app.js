import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import guideRoutes from './routes/guideRoutes.js';


const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors()); // Allow all origins for web (for testing)
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/guides', guideRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
