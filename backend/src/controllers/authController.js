import jwt from 'jsonwebtoken';
import { User, Driver } from '../models/index.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (Rider or Driver)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, vehicle } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create the User (Base account)
    // Note: Ensure your User model enum includes 'rider' and 'driver'
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'rider',
    });

    // 3. If the role is 'driver', create the Driver profile linked to this user
    if (user && role === 'driver') {
      await Driver.create({
        user: user._id,
        vehicle: {
          make: vehicle?.make || 'Standard',
          model: vehicle?.model || 'Vehicle',
          licensePlate: vehicle?.licensePlate || 'PENDING',
          type: vehicle?.type || 'STANDARD'
        },
        isOnline: false
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google OAuth Callback Handler
export const googleAuthCallback = (req, res) => {
  const token = generateToken(req.user._id);
  // Redirect back to frontend with token as URL param
  const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(`${frontendUrl}/login?token=${token}`);
};

// @desc    Forgot Password (Placeholder logic)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Logic for sending email would go here
    res.json({ message: 'Password reset instructions sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};