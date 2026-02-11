// backend/models/Category.js
// UPDATED - Removed productCount field (calculated dynamically instead)

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    description: {
      type: String,
      trim: true,
    },
    
    image: {
      type: String,
      default: '',
    },
    
    icon: {
      type: String,
      default: '',
    },
    
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    
    level: {
      type: Number,
      default: 0, // 0 = main category, 1 = subcategory, etc.
    },
    
    order: {
      type: Number,
      default: 0,
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
    
    isFeatured: {
      type: Boolean,
      default: false,
    },
    
    // REMOVED: productCount field
    // This is now calculated dynamically in the controller
    
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ order: 1 });

// Generate slug from name before saving
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
});

module.exports = mongoose.model('Category', categorySchema);