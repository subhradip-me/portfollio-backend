import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Project validation rules
export const validateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  
  body('subtitle')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subtitle must not exceed 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  
  body('tech')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),
  
  body('tech.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each technology must not exceed 50 characters'),
  
  body('year')
    .optional()
    .trim()
    .matches(/^\d{4}$/)
    .withMessage('Year must be a 4-digit number'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  
  body('thumbnailUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Thumbnail URL must be a valid URL'),
  
  handleValidationErrors
];

// Testimonial validation rules
export const validateTestimonial = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Client name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position must not exceed 100 characters'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company must not exceed 100 characters'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Testimonial message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value'),
  
  body('avatarUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  
  handleValidationErrors
];

// Auth validation rules
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  handleValidationErrors
];

export const validateRegister = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];
