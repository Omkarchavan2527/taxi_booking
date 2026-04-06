import express from 'express';
import { 
  estimateRide, 
  bookRide, 
  verifyOtp, 
  updateRideStatus, 
  rateRide,
  requestRide,
  acceptRide,
  getPendingRides
} from '../controllers/rideController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

// Require user to be logged in for all ride actions
router.use(protect);

// Booking flows
router.post('/estimate', estimateRide);
router.post('/book', bookRide);
router.post('/request', requestRide);
router.get('/pending', getPendingRides);

// Execution flows
router.post('/:id/verify-otp', verifyOtp);
router.patch('/:id/status', updateRideStatus);
router.post('/:id/rate', rateRide);

router.put('/:id/accept', acceptRide);
export default router;