import express from 'express';
import { 
  getTestimonials, 
  getTestimonial, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial,
  toggleFeatured,
  getFeaturedTestimonials 
} from '../controllers/testimonialController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateTestimonial } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedTestimonials);
router.get('/:id', getTestimonial);

// Protected routes (require authentication)
router.get('/', authenticateToken, requireAdmin, getTestimonials);
router.post('/', authenticateToken, requireAdmin, validateTestimonial, createTestimonial);
router.put('/:id', authenticateToken, requireAdmin, validateTestimonial, updateTestimonial);
router.delete('/:id', authenticateToken, requireAdmin, deleteTestimonial);
router.patch('/:id/toggle-featured', authenticateToken, requireAdmin, toggleFeatured);

export default router;
