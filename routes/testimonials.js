import express from 'express';
import { 
  getTestimonials, 
  getTestimonial, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial,
  toggleFeatured,
  getFeaturedTestimonials,
  approveTestimonial,
  getTestimonialsByRating,
  getTestimonialStats
} from '../controllers/testimonialController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateTestimonial } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedTestimonials);
router.get('/rating/:rating', getTestimonialsByRating);

// Protected routes (require authentication and admin role)
router.get('/statistics', authenticateToken, requireAdmin, getTestimonialStats);
router.get('/', authenticateToken, requireAdmin, getTestimonials);
router.post('/', authenticateToken, requireAdmin, validateTestimonial, createTestimonial);
router.put('/:id', authenticateToken, requireAdmin, validateTestimonial, updateTestimonial);
router.patch('/:id/approve', authenticateToken, requireAdmin, approveTestimonial);
router.patch('/:id/toggle-featured', authenticateToken, requireAdmin, toggleFeatured);
router.delete('/:id', authenticateToken, requireAdmin, deleteTestimonial);

// Public route for single testimonial (must be after other routes)
router.get('/:id', getTestimonial);

export default router;
