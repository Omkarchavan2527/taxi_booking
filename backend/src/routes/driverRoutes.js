import express from 'express';
import { getDriverProfile, updateDriverStatus, getDriverEarnings } from '../controllers/driverController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware to ensure the user is actually a driver
const driverOnly = (req, res, next) => {
  if (req.user && req.user.role === 'driver') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a driver' });
  }
};

// All routes here require the user to be logged in AND be a driver
router.use(protect, driverOnly);

router.get('/profile', getDriverProfile);
router.patch('/status', updateDriverStatus);
router.get('/earnings', getDriverEarnings);

export default router;