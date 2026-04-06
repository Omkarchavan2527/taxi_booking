import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import passport from 'passport';
import driverRoutes from './routes/driverRoutes.js';
import { configurePassport } from './config/passport.js';
import chatRoutes from './routes/chatRoutes.js';

// app.use('/api/auth', authRoutes);
// app.use('/api/rides', rideRoutes);
dotenv.config();
const app = express();
app.use(express.json());
configurePassport();
app.use(passport.initialize());
// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'SwiftRide API is running' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/chat', chatRoutes);
// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;