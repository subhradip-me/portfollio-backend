import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    featured, 
    year, 
    tech, 
    status = 'published',
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  let query = {};
  
  // Filter by status (default to published for public access)
  if (status && req.user?.role === 'admin') {
    query.status = status;
  } else {
    query.status = 'published';
  }

  // Filter by featured status
  if (featured !== undefined) {
    query.featured = featured === 'true';
  }

  // Filter by year
  if (year) {
    query.year = year;
  }

  // Filter by technology
  if (tech) {
    query.technologies = { $in: [new RegExp(tech, 'i')] };
  }

  // Search by title or description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { technologies: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Execute query with pagination
  const projects = await Project.find(query)
    .populate('createdBy', 'username email')
    .populate('updatedBy', 'username email')
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Project.countDocuments(query);

  res.json({
    success: true,
    projects,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
      limit: parseInt(limit)
    }
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'username email')
    .populate('updatedBy', 'username email');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Only show published projects to non-admin users
  if (project.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Increment view count (only for published projects)
  if (project.status === 'published') {
    await project.incrementViews();
  }

  res.json({
    success: true,
    project
  });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = asyncHandler(async (req, res) => {
  const projectData = {
    ...req.body,
    createdBy: req.user.id,
    updatedBy: req.user.id
  };

  // Handle technologies field (backward compatibility)
  if (req.body.tech) {
    projectData.technologies = Array.isArray(req.body.tech) 
      ? req.body.tech 
      : req.body.tech.split(',').map(t => t.trim());
  }

  const project = await Project.create(projectData);

  // Populate creator info
  await project.populate('createdBy', 'username email');

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const updateData = {
    ...req.body,
    updatedBy: req.user.id
  };

  // Handle technologies field (backward compatibility)
  if (req.body.tech) {
    updateData.technologies = Array.isArray(req.body.tech) 
      ? req.body.tech 
      : req.body.tech.split(',').map(t => t.trim());
  }

  // Remove fields that shouldn't be updated
  delete updateData.createdBy;
  delete updateData._id;

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate('createdBy updatedBy', 'username email');

  res.json({
    success: true,
    message: 'Project updated successfully',
    project: updatedProject
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await Project.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Project deleted successfully',
    deletedProject: project
  });
});

// @desc    Toggle featured status
// @route   PATCH /api/projects/:id/featured
// @access  Private/Admin
export const toggleFeatured = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { featured } = req.body;
  
  if (typeof featured !== 'boolean') {
    res.status(400);
    throw new Error('Featured must be a boolean value');
  }

  project.featured = featured;
  project.updatedBy = req.user.id;
  await project.save();

  res.json({
    success: true,
    message: 'Project featured status updated successfully',
    project
  });
});

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
export const getFeaturedProjects = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const projects = await Project.findFeatured()
    .populate('createdBy', 'username email')
    .sort({ updatedAt: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    projects,
    total: projects.length
  });
});

// @desc    Get projects by year
// @route   GET /api/projects/year/:year
// @access  Public
export const getProjectsByYear = asyncHandler(async (req, res) => {
  const { year } = req.params;
  const { limit = 10, page = 1 } = req.query;

  const projects = await Project.findByYear(year)
    .populate('createdBy', 'username email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Project.countDocuments({ year, status: 'published' });

  res.json({
    success: true,
    projects,
    year,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
      limit: parseInt(limit)
    }
  });
});

// @desc    Get projects by technology
// @route   GET /api/projects/technology/:tech
// @access  Public
export const getProjectsByTechnology = asyncHandler(async (req, res) => {
  const { tech } = req.params;
  const { limit = 10, page = 1 } = req.query;

  const projects = await Project.findByTechnology(tech)
    .populate('createdBy', 'username email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Project.countDocuments({ 
    technologies: { $in: [new RegExp(tech, 'i')] },
    status: 'published' 
  });

  res.json({
    success: true,
    projects,
    technology: tech,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
      limit: parseInt(limit)
    }
  });
});

// @desc    Get project statistics
// @route   GET /api/projects/stats/summary
// @access  Private/Admin
export const getProjectStats = asyncHandler(async (req, res) => {
  const stats = await Project.getStats();
  
  // Get year distribution
  const yearDistribution = await Project.aggregate([
    { $match: { status: 'published' } },
    {
      $group: {
        _id: '$year',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ]);

  // Get technology distribution
  const techDistribution = await Project.aggregate([
    { $match: { status: 'published' } },
    { $unwind: '$technologies' },
    {
      $group: {
        _id: '$technologies',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  // Get recent projects
  const recentProjects = await Project.find({ status: 'published' })
    .select('title createdAt viewCount featured')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    stats: {
      ...stats[0],
      yearDistribution,
      techDistribution,
      recentProjects
    }
  });
});

// @desc    Duplicate project
// @route   POST /api/projects/:id/duplicate
// @access  Private/Admin
export const duplicateProject = asyncHandler(async (req, res) => {
  const originalProject = await Project.findById(req.params.id);

  if (!originalProject) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Create new project with copied data
  const duplicatedData = {
    title: `${originalProject.title} (Copy)`,
    subtitle: originalProject.subtitle,
    description: originalProject.description,
    technologies: [...originalProject.technologies],
    year: originalProject.year,
    featured: false, // Don't duplicate featured status
    thumbnailUrl: originalProject.thumbnailUrl,
    liveUrl: originalProject.liveUrl,
    githubUrl: originalProject.githubUrl,
    status: 'draft', // Always create as draft
    tags: [...originalProject.tags],
    createdBy: req.user.id,
    updatedBy: req.user.id
  };

  const duplicatedProject = await Project.create(duplicatedData);
  await duplicatedProject.populate('createdBy', 'username email');

  res.status(201).json({
    success: true,
    message: 'Project duplicated successfully',
    project: duplicatedProject
  });
});
