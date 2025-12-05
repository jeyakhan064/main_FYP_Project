import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if JWT_SECRET is configured
      if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET is not configured in .env file');
        return res.status(500).json({
          message: 'Server configuration error: JWT_SECRET not configured'
        });
      }

      // Check MongoDB connection
      if (!mongoose.connection.readyState) {
        console.error('❌ MongoDB is not connected');
        return res.status(500).json({
          message: 'Database connection error. Please try again later.'
        });
      }

      // Check if user already exists
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (error) {
      console.error('❌ Signup Error:', error.message);
      console.error('Full error:', error);
      res.status(500).json({
        message: 'Server error during signup',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if JWT_SECRET is configured
      if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET is not configured in .env file');
        return res.status(500).json({
          message: 'Server configuration error: JWT_SECRET not configured'
        });
      }

      // Check MongoDB connection
      if (!mongoose.connection.readyState) {
        console.error('❌ MongoDB is not connected');
        return res.status(500).json({
          message: 'Database connection error. Please try again later.'
        });
      }

      // Check for user (include password for comparison)
      const user = await User.findOne({ email }).select('+password');

      if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('❌ Login Error:', error.message);
      console.error('Full error:', error);
      res.status(500).json({
        message: 'Server error during login',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Please enter a valid email')],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      // Check MongoDB connection
      if (!mongoose.connection.readyState) {
        console.error('❌ MongoDB is not connected');
        return res.status(500).json({
          message: 'Database connection error. Please try again later.'
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString('hex');

      // Hash token and set to resetPasswordToken field
      user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Set expire time (10 minutes)
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

      await user.save();

      // Create reset URL
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      // TODO: Send email with reset URL
      // For now, just return the reset token (in production, send via email)
      res.json({
        message: 'Password reset token generated',
        resetToken, // Remove this in production
        resetUrl, // Remove this in production
      });
    } catch (error) {
      console.error('❌ Forgot Password Error:', error.message);
      console.error('Full error:', error);
      res.status(500).json({
        message: 'Server error during password reset',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// @route   PUT /api/auth/reset-password/:resetToken
// @desc    Reset password
// @access  Public
router.put(
  '/reset-password/:resetToken',
  [
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Get hashed token
      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // Set new password
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.json({
        message: 'Password reset successful',
        token: generateToken(user._id),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
