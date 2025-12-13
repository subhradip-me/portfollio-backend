import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    minlength: [2, 'Title must be at least 2 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  technologies: [{
    type: String,
    trim: true,
    maxlength: [50, 'Technology name cannot exceed 50 characters']
  }],
  year: {
    type: String,
    match: [/^\d{4}$/, 'Year must be a 4-digit number'],
    default: () => new Date().getFullYear().toString()
  },
  featured: {
    type: Boolean,
    default: false
  },
  thumbnailUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Thumbnail URL must be a valid URL'
    }
  },
  liveUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Live URL must be a valid URL'
    }
  },
  githubUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'GitHub URL must be a valid URL'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
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

// Indexes for performance and queries
projectSchema.index({ title: 1 });
projectSchema.index({ year: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ technologies: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ createdAt: -1 });

// Compound indexes
projectSchema.index({ status: 1, featured: -1, createdAt: -1 });
projectSchema.index({ year: 1, featured: -1 });

// Virtual for tech (backward compatibility)
projectSchema.virtual('tech').get(function() {
  return this.technologies;
});

projectSchema.virtual('tech').set(function(value) {
  this.technologies = Array.isArray(value) ? value : value.split(',').map(t => t.trim());
});

// Virtual for formatted date
projectSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Static methods
projectSchema.statics.findPublished = function() {
  return this.find({ status: 'published' });
};

projectSchema.statics.findFeatured = function() {
  return this.find({ featured: true, status: 'published' });
};

projectSchema.statics.findByYear = function(year) {
  return this.find({ year, status: 'published' });
};

projectSchema.statics.findByTechnology = function(tech) {
  return this.find({ 
    technologies: { $in: [new RegExp(tech, 'i')] },
    status: 'published' 
  });
};

projectSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        featured: { 
          $sum: { $cond: ['$featured', 1, 0] } 
        },
        published: { 
          $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } 
        },
        draft: { 
          $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } 
        },
        totalViews: { $sum: '$viewCount' }
      }
    }
  ]);
};

// Instance methods
projectSchema.methods.incrementViews = function() {
  this.viewCount = (this.viewCount || 0) + 1;
  return this.save();
};

projectSchema.methods.toggleFeatured = function() {
  this.featured = !this.featured;
  return this.save();
};

// Middleware
projectSchema.pre('save', function(next) {
  if (this.isModified('technologies')) {
    // Clean up technologies array
    this.technologies = this.technologies
      .filter(tech => tech && tech.trim())
      .map(tech => tech.trim());
  }
  
  if (this.isModified('tags')) {
    // Clean up tags array
    this.tags = this.tags
      .filter(tag => tag && tag.trim())
      .map(tag => tag.trim().toLowerCase());
  }
  
  next();
});

export default mongoose.model('Project', projectSchema);
