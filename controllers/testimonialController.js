import asyncHandler from 'express-async-handler';
import Testimonial from '../models/Testimonial.js';

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    featured, 
    rating, 
    company, 
    status = 'approved',
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  let query = {};
  
  // Filter by status (default to approved for public access)
  if (status && req.user?.role === 'admin') {
    query.status = status;
  } else {
    query.status = 'approved';
  }

  // Filter by featured status
  if (featured !== undefined) {
    query.featured = featured === 'true';
  }

  // Filter by minimum rating
  if (rating) {
    const minRating = parseInt(rating);
    if (!isNaN(minRating)) {
      query.rating = { $gte: minRating };
    }
  }

  // Filter by company
  if (company) {
    query.company = { $regex: company, $options: 'i' };
  }

  // Search by name, company, or message
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } }
    ];
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Execute query with pagination
  const testimonials = await Testimonial.find(query)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Testimonial.countDocuments(query);

  res.json({
    success: true,
    testimonials,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
      limit: parseInt(limit)
    }
  });
});

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
export const getTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  // Only show approved testimonials to non-admin users
  if (testimonial.status !== 'approved' && (!req.user || req.user.role !== 'admin')) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  res.json({
    success: true,
    testimonial
  });
});

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonialData = {
    ...req.body,
    createdBy: req.user.id,
    updatedBy: req.user.id
  };

  // Ensure rating is a number
  if (testimonialData.rating) {
    testimonialData.rating = parseInt(testimonialData.rating);
  }

  const testimonial = await Testimonial.create(testimonialData);

  res.status(201).json({
    success: true,
    message: 'Testimonial created successfully',
    testimonial
  });
});

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  const updateData = {
    ...req.body,
    updatedBy: req.user.id
  };

  // Ensure rating is a number
  if (updateData.rating) {
    updateData.rating = parseInt(updateData.rating);
  }

  // Remove fields that shouldn't be updated
  delete updateData.createdBy;
  delete updateData._id;

  const updatedTestimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Testimonial updated successfully',
    testimonial: updatedTestimonial
  });
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  await Testimonial.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Testimonial deleted successfully',
    deletedTestimonial: testimonial
  });
});

// @desc    Toggle featured status
// @route   PATCH /api/testimonials/:id/toggle-featured
// @access  Private/Admin
export const toggleFeatured = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  // Toggle the featured status
  testimonial.featured = !testimonial.featured;
  testimonial.updatedBy = req.user.id;
  await testimonial.save();

  res.json({
    success: true,
    message: `Testimonial ${testimonial.featured ? 'marked as featured' : 'unmarked as featured'} successfully`,
    testimonial
  });
});

// @desc    Approve testimonial
// @route   PATCH /api/testimonials/:id/approve
// @access  Private/Admin
export const approveTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  await testimonial.approve();
  testimonial.updatedBy = req.user.id;
  await testimonial.save();

  res.json({
    success: true,
    message: 'Testimonial approved successfully',
    testimonial
  });
});

// @desc    Reject testimonial
// @route   PATCH /api/testimonials/:id/reject
// @access  Private/Admin
export const rejectTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  await testimonial.reject();
  testimonial.updatedBy = req.user.id;
  await testimonial.save();

  res.json({
    success: true,
    message: 'Testimonial rejected successfully',
    testimonial
  });
});

// @desc    Get featured testimonials
// @route   GET /api/testimonials/featured
// @access  Public
export const getFeaturedTestimonials = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const testimonials = await Testimonial.find({ featured: true, status: 'approved' })
    .sort({ updatedAt: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    testimonials,
    total: testimonials.length
  });
});

// @desc    Get testimonials by rating
// @route   GET /api/testimonials/rating/:rating
// @access  Public
export const getTestimonialsByRating = asyncHandler(async (req, res) => {
  const { rating } = req.params;
  const { limit = 10, page = 1 } = req.query;

  const minRating = parseInt(rating);
  if (isNaN(minRating) || minRating < 1 || minRating > 5) {
    res.status(400);
    throw new Error('Invalid rating. Must be between 1 and 5');
  }

  const testimonials = await Testimonial.find({ 
    rating: { $gte: minRating },
    status: 'approved' 
  })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Testimonial.countDocuments({ 
    rating: { $gte: minRating },
    status: 'approved' 
  });

  res.json({
    success: true,
    testimonials,
    rating: minRating,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
      limit: parseInt(limit)
    }
  });
});

// @desc    Get testimonials by company
// @route   GET /api/testimonials/company/:company
// @access  Public
export const getTestimonialsByCompany = asyncHandler(async (req, res) => {
  const { company } = req.params;
  const { limit = 10, page = 1 } = req.query;

  const testimonials = await Testimonial.find({ 
    company: new RegExp(company, 'i'),
    status: 'approved' 
  })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Testimonial.countDocuments({ 
    company: new RegExp(company, 'i'),
    status: 'approved' 
  });

  res.json({
    success: true,
    testimonials,
    company,
    pagination: {
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
      limit: parseInt(limit)
    }
  });
});

// @desc    Get testimonial statistics
// @route   GET /api/testimonials/statistics
// @access  Private/Admin
export const getTestimonialStats = asyncHandler(async (req, res) => {
  const stats = await Testimonial.aggregate([
    {
      $facet: {
        totalStats: [
          {
            $group: {
              _id: null,
              totalTestimonials: { $sum: 1 },
              approvedTestimonials: {
                $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
              },
              pendingTestimonials: {
                $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
              },
              featuredTestimonials: {
                $sum: { $cond: ['$featured', 1, 0] }
              },
              averageRating: { $avg: '$rating' }
            }
          }
        ],
        ratingDistribution: [
          {
            $group: {
              _id: '$rating',
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ],
        companyDistribution: [
          { $match: { company: { $exists: true, $ne: '' } } },
          {
            $group: {
              _id: '$company',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]
      }
    }
  ]);

  // Get recent testimonials
  const recentTestimonials = await Testimonial.find({ status: 'approved' })
    .select('name company rating createdAt featured')
    .sort({ createdAt: -1 })
    .limit(5);

  const result = stats[0];
  const totalStats = result.totalStats[0] || {
    totalTestimonials: 0,
    approvedTestimonials: 0,
    pendingTestimonials: 0,
    featuredTestimonials: 0,
    averageRating: 0
  };

  res.json({
    success: true,
    stats: {
      ...totalStats,
      ratingDistribution: result.ratingDistribution,
      companyDistribution: result.companyDistribution,
      recentTestimonials
    }
  });
});

// @desc    Verify testimonial
// @route   PATCH /api/testimonials/:id/verify
// @access  Private/Admin
export const verifyTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);

  if (!testimonial) {
    res.status(404);
    throw new Error('Testimonial not found');
  }

  await testimonial.verify();
  testimonial.updatedBy = req.user.id;
  await testimonial.save();

  res.json({
    success: true,
    message: 'Testimonial verified successfully',
    testimonial
  });
});
