// backend/controllers/categoryController.js
// UPDATED - With dynamic product count calculation

const Category = require('../models/Category');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res) => {
  try {
    const { search, isActive, isFeatured, parentCategory } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }
    
    if (parentCategory !== undefined) {
      query.parentCategory = parentCategory === 'null' ? null : parentCategory;
    }
    
    const categories = await Category.find(query)
      .populate('parentCategory', 'name slug')
      .sort({ order: 1, createdAt: -1 });
    
    // DYNAMIC PRODUCT COUNT - Calculate for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
          status: 'active'
        });
        
        // Convert to plain object and add productCount
        const categoryObj = category.toObject();
        categoryObj.productCount = productCount;
        
        return categoryObj;
      })
    );
    
    res.status(200).json({
      success: true,
      categories: categoriesWithCount,
      total: categoriesWithCount.length,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name slug');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    
    // Calculate product count dynamically
    const productCount = await Product.countDocuments({
      category: category._id,
      status: 'active'
    });
    
    const categoryObj = category.toObject();
    categoryObj.productCount = productCount;
    
    res.status(200).json({
      success: true,
      category: categoryObj,
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message,
    });
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('parentCategory', 'name slug');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    
    // Calculate product count dynamically
    const productCount = await Product.countDocuments({
      category: category._id,
      status: 'active'
    });
    
    const categoryObj = category.toObject();
    categoryObj.productCount = productCount;
    
    res.status(200).json({
      success: true,
      category: categoryObj,
    });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message,
    });
  }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      icon,
      parentCategory,
      level,
      order,
      isActive,
      isFeatured,
      seo,
    } = req.body;
    
    // Check if category name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }
    
    const categoryData = {
      name,
      description,
      icon,
      parentCategory: parentCategory || null,
      level: level || 0,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false,
      seo,
    };
    
    // Handle image upload
    if (req.file) {
      categoryData.image = req.file.filename;
    }
    
    const category = await Category.create(categoryData);
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    
    // Delete uploaded file if error
    if (req.file) {
      const imagePath = path.join(__dirname, '..', 'uploads', 'categories', req.file.filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message,
    });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      // Delete uploaded file if category not found
      if (req.file) {
        const imagePath = path.join(__dirname, '..', 'uploads', 'categories', req.file.filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    
    const {
      name,
      description,
      icon,
      parentCategory,
      level,
      order,
      isActive,
      isFeatured,
      seo,
    } = req.body;
    
    // Check if new name conflicts with existing category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        if (req.file) {
          const imagePath = path.join(__dirname, '..', 'uploads', 'categories', req.file.filename);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists',
        });
      }
      category.name = name;
    }
    
    if (description !== undefined) category.description = description;
    if (icon !== undefined) category.icon = icon;
    if (parentCategory !== undefined) category.parentCategory = parentCategory || null;
    if (level !== undefined) category.level = level;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;
    if (isFeatured !== undefined) category.isFeatured = isFeatured;
    if (seo) category.seo = seo;
    
    // Handle image upload
    if (req.file) {
      // Delete old image
      if (category.image) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', 'categories', category.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      category.image = req.file.filename;
    }
    
    await category.save();
    
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    console.error('Update category error:', error);
    
    // Delete uploaded file if error
    if (req.file) {
      const imagePath = path.join(__dirname, '..', 'uploads', 'categories', req.file.filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message,
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    
    // Check if category has products - UPDATED to use category ID
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productCount} products are using this category.`,
      });
    }
    
    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ parentCategory: category._id });
    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${subcategoryCount} subcategories.`,
      });
    }
    
    // Delete category image
    if (category.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', 'categories', category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await category.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message,
    });
  }
};

// @desc    Toggle category active status
// @route   PUT /api/admin/categories/:id/toggle-active
// @access  Private/Admin
exports.toggleActive = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    
    category.isActive = !category.isActive;
    await category.save();
    
    res.status(200).json({
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      category,
    });
  } catch (error) {
    console.error('Toggle active error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle category status',
      error: error.message,
    });
  }
};

// @desc    Toggle category featured status
// @route   PUT /api/admin/categories/:id/toggle-featured
// @access  Private/Admin
exports.toggleFeatured = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    
    category.isFeatured = !category.isFeatured;
    await category.save();
    
    res.status(200).json({
      success: true,
      message: `Category ${category.isFeatured ? 'marked as featured' : 'removed from featured'}`,
      category,
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle featured status',
      error: error.message,
    });
  }
};

// @desc    Delete category image
// @route   DELETE /api/admin/categories/:id/image
// @access  Private/Admin
exports.deleteCategoryImage = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    
    if (category.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', 'categories', category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      category.image = '';
      await category.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Category image deleted successfully',
      category,
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message,
    });
  }
};