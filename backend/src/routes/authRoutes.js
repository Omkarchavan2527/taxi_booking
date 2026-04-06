import express from 'express';
import passport from 'passport';
// 👇 THE FIX IS RIGHT HERE: Make sure forgotPassword is in this list!
import { register, login, getMe, googleAuthCallback, forgotPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Local Auth
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);

// Google OAuth 2.0 Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback Route
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }), 
  googleAuthCallback
);

export default router;