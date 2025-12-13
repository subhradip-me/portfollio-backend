import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public (can be restricted in production)
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    res.status(409);
    throw new Error('User with this email already exists');
  }

  // Check if username is taken
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    res.status(409);
    throw new Error('Username is already taken');
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: 'admin' // All registered users are admins for portfolio
  });

  // Update last login
  await user.updateLastLogin();

  // Generate token
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: user.toJSON(), // This will exclude password due to transform
    token,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findByEmail(email).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    res.status(401);
    throw new Error('Account is deactivated');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Update last login
  await user.updateLastLogin();

  // Generate token
  const token = generateToken(user);

  res.json({
    success: true,
    message: 'Login successful',
    user: user.toJSON(), // This will exclude password
    token,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    user: user.toJSON()
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { username, email, profileImage } = req.body;
  
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if email is being changed and not already taken
  if (email && email !== user.email) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      res.status(409);
      throw new Error('Email is already in use');
    }
  }

  // Check if username is being changed and not already taken
  if (username && username !== user.username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(409);
      throw new Error('Username is already taken');
    }
  }

  // Update user
  user.username = username || user.username;
  user.email = email || user.email;
  user.profileImage = profileImage || user.profileImage;

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: user.toJSON()
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  // Hash new password
  const saltRounds = 12;
  user.password = await bcrypt.hash(newPassword, saltRounds);

  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Verify token
// @route   POST /api/auth/verify-token
// @access  Public
export const verifyToken = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401);
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      res.status(401);
      throw new Error('Invalid token');
    }

    res.json({
      success: true,
      valid: true,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(401);
    throw new Error('Invalid token');
  }
});

// @desc    Logout user (invalidate token on client side)
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  // Note: With JWT, we can't really "logout" server-side without maintaining a blacklist
  // The client should remove the token from storage
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Get all users (admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, role } = req.query;
  
  let query = {};
  
  // Search by username or email
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Filter by role
  if (role) {
    query.role = role;
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    users,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
      limit: parseInt(limit)
    }
  });
});
