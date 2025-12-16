import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  toggleFeatured,
  getProjectsByTechnology,
  getProjectsByYear,
  getProjectStats
} from '../controllers/projectController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateProject } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/statistics', getProjectStats);
router.get('/technology/:tech', getProjectsByTechnology);
router.get('/year/:year', getProjectsByYear);
router.get('/:id', getProject);

// Protected routes (require authentication)
router.post('/', authenticateToken, requireAdmin, validateProject, createProject);
router.put('/:id', authenticateToken, requireAdmin, validateProject, updateProject);
router.patch('/:id/toggle-featured', authenticateToken, requireAdmin, toggleFeatured);
router.delete('/:id', authenticateToken, requireAdmin, deleteProject);

export default router;
