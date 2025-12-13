import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  position: {
    type: String,
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Testimonial message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer'
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  avatarUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Avatar URL must be a valid URL'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Website URL must be a valid URL'
    }
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for performance
testimonialSchema.index({ rating: 1 });
testimonialSchema.index({ featured: 1 });
testimonialSchema.index({ status: 1 });
testimonialSchema.index({ company: 1 });
testimonialSchema.index({ createdAt: -1 });
testimonialSchema.index({ verified: 1 });

// Compound indexes
testimonialSchema.index({ status: 1, featured: -1, rating: -1 });
testimonialSchema.index({ featured: 1, rating: -1, createdAt: -1 });

// Virtual for full name/title
testimonialSchema.virtual('fullTitle').get(function() {
  let title = this.name;
  if (this.position && this.company) {
    title += `, ${this.position} at ${this.company}`;
  } else if (this.position) {
    title += `, ${this.position}`;
  } else if (this.company) {
    title += ` from ${this.company}`;
  }
  return title;
});

// Virtual for rating stars
testimonialSchema.virtual('ratingStars').get(function() {
  return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
});

// Virtual for formatted date
testimonialSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Static methods
testimonialSchema.statics.findApproved = function() {
  return this.find({ status: 'approved' });
};

testimonialSchema.statics.findFeatured = function() {
  return this.find({ featured: true, status: 'approved' });
};

testimonialSchema.statics.findByRating = function(minRating) {
  return this.find({ 
    rating: { $gte: minRating },
    status: 'approved' 
  });
};

testimonialSchema.statics.findByCompany = function(company) {
  return this.find({ 
    company: new RegExp(company, 'i'),
    status: 'approved' 
  });
};

testimonialSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        featured: { 
          $sum: { $cond: ['$featured', 1, 0] } 
        },
        approved: { 
          $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } 
        },
        pending: { 
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } 
        },
        averageRating: { $avg: '$rating' },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);
};

testimonialSchema.statics.getRatingDistribution = function() {
  return this.aggregate([
    { $match: { status: 'approved' } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

testimonialSchema.statics.getTopCompanies = function(limit = 10) {
  return this.aggregate([
    { 
      $match: { 
        status: 'approved', 
        company: { $exists: true, $ne: '' }
      } 
    },
    {
      $group: {
        _id: '$company',
        count: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        testimonials: {
          $push: {
            name: '$name',
            message: '$message',
            rating: '$rating'
          }
        }
      }
    },
    { $sort: { count: -1, averageRating: -1 } },
    { $limit: limit }
  ]);
};

// Instance methods
testimonialSchema.methods.approve = function() {
  this.status = 'approved';
  return this.save();
};

testimonialSchema.methods.reject = function() {
  this.status = 'rejected';
  return this.save();
};

testimonialSchema.methods.toggleFeatured = function() {
  this.featured = !this.featured;
  return this.save();
};

testimonialSchema.methods.verify = function() {
  this.verified = true;
  return this.save();
};

// Middleware
testimonialSchema.pre('save', function(next) {
  // Auto-feature 5-star testimonials from verified sources
  if (this.isNew && this.rating === 5 && this.verified) {
    this.featured = true;
  }
  
  next();
});

// Post-save middleware to limit featured testimonials
testimonialSchema.post('save', async function(doc) {
  if (doc.featured) {
    // Keep only top 10 featured testimonials
    const featuredCount = await this.constructor.countDocuments({ 
      featured: true, 
      _id: { $ne: doc._id } 
    });
    
    if (featuredCount >= 10) {
      // Remove featured status from oldest featured testimonial
      const oldestFeatured = await this.constructor
        .findOne({ 
          featured: true, 
          _id: { $ne: doc._id } 
        })
        .sort({ updatedAt: 1 });
      
      if (oldestFeatured) {
        oldestFeatured.featured = false;
        await oldestFeatured.save();
      }
    }
  }
});

export default mongoose.model('Testimonial', testimonialSchema);
