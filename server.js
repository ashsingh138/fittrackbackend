import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import dataRoutes from './routes/dataRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// --- ROUTES ---
app.use('/api/users', userRoutes);
app.use('/api', dataRoutes); // This handles /api/workouts, /api/diet, etc.

app.get('/', (req, res) => {
  res.send('FitTrack API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});