import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword,
  logout,
  getUsers 
} from '../controllers/authController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateLogin, validateRegister } from '../middleware/validation.js';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/login', authLimiter, validateLogin, login);
router.post('/register', authLimiter, validateRegister, register);

// Protected routes
router.get('/me', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);
router.post('/logout', authenticateToken, logout);

// Admin only routes
router.get('/users', authenticateToken, requireAdmin, getUsers);

export default router;
