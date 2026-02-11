const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// @desc    Get All Products (Admin)
// @route   GET /api/admin/products
// @access  Private (Admin)
exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      category = 'all',
      status = 'all',
      featured = 'all',
    } = req.query;

    // Build query
    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'description.short': { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter - Now using ObjectId
    if (category !== 'all') {
      // Find category by name to get its ObjectId
      const categoryDoc = await Category.findOne({ name: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Status filter
    if (status !== 'all') {
      query.status = status;
    }

    // Featured filter
    if (featured !== 'all') {
      query.isFeatured = featured === 'true';
    }

    // Execute query with pagination and populate category
    const products = await Product.find(query)
      .populate('category', 'name') // Populate category name
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const count = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get Single Product
// @route   GET /api/admin/products/:id
// @access  Private (Admin)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'fullName email')
      .populate('updatedBy', 'fullName email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Create Product
// @route   POST /api/admin/products
// @access  Private (Admin)
exports.createProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData || '{}');

    // Validate required fields
    if (!productData.name || !productData.category || !productData.price?.mrp || !productData.price?.selling) {
      // Delete uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const filePath = path.join(__dirname, '../public/uploads/products', file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, category, mrp, selling price)',
      });
    }

    // Calculate discount
    if (productData.price?.mrp && productData.price?.selling) {
      productData.price.discount = Math.round(
        ((productData.price.mrp - productData.price.selling) / productData.price.mrp) * 100
      );
    }

    // Handle uploaded images - save filenames only
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => file.filename);
      productData.thumbnail = req.files[0].filename; // First image as thumbnail
    }

    // Set created by
    productData.createdBy = req.admin._id;
    productData.updatedBy = req.admin._id;

    // Create product
    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);

    // Delete uploaded files if product creation fails
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../public/uploads/products', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A product with this name already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update Product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      // Delete uploaded files if product not found
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          const filePath = path.join(__dirname, '../public/uploads/products', file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }

      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updateData = JSON.parse(req.body.productData || '{}');

    // Calculate discount if prices are updated
    if (updateData.price?.mrp && updateData.price?.selling) {
      updateData.price.discount = Math.round(
        ((updateData.price.mrp - updateData.price.selling) / updateData.price.mrp) * 100
      );
    }

    // Handle new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);

      // If keepExistingImages flag is true, append new images
      if (req.body.keepExistingImages === 'true') {
        updateData.images = [...(product.images || []), ...newImages];
      } else {
        // Delete old images from filesystem
        if (product.images && product.images.length > 0) {
          product.images.forEach(filename => {
            const filePath = path.join(__dirname, '../public/uploads/products', filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });
        }
        updateData.images = newImages;
      }

      // Set first image as thumbnail if not set
      if (!updateData.thumbnail && updateData.images.length > 0) {
        updateData.thumbnail = updateData.images[0];
      }
    }

    // Set updated by
    updateData.updatedBy = req.admin._id;

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);

    // Delete uploaded files if update fails
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../public/uploads/products', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A product with this name already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete Product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete associated images from filesystem
    if (product.images && product.images.length > 0) {
      product.images.forEach(filename => {
        const filePath = path.join(__dirname, '../public/uploads/products', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete Product Image
// @route   DELETE /api/admin/products/:id/images/:filename
// @access  Private (Admin)
exports.deleteProductImage = async (req, res) => {
  try {
    const { id, filename } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Remove image from array
    product.images = product.images.filter(img => img !== filename);

    // If deleted image was thumbnail, set new thumbnail
    if (product.thumbnail === filename && product.images.length > 0) {
      product.thumbnail = product.images[0];
    } else if (product.images.length === 0) {
      product.thumbnail = null;
    }

    await product.save();

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../public/uploads/products', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      product,
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Toggle Product Featured Status
// @route   PUT /api/admin/products/:id/toggle-featured
// @access  Private (Admin)
exports.toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.isFeatured = !product.isFeatured;
    product.updatedBy = req.admin._id;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isFeatured ? 'marked as featured' : 'removed from featured'}`,
      product: {
        _id: product._id,
        isFeatured: product.isFeatured,
      },
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update Product Status
// @route   PUT /api/admin/products/:id/status
// @access  Private (Admin)
exports.updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'inactive', 'draft'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.status = status;
    product.updatedBy = req.admin._id;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product status updated successfully',
      product: {
        _id: product._id,
        status: product.status,
      },
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get Product Statistics
// @route   GET /api/admin/products/stats
// @access  Private (Admin)
exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const outOfStock = await Product.countDocuments({ 'stock.status': 'Out of Stock' });

    // Get new products this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newProductsThisMonth = await Product.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Category breakdown
    const categoryBreakdown = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        featuredProducts,
        outOfStock,
        inactiveProducts: totalProducts - activeProducts,
        newProductsThisMonth,
        categoryBreakdown,
      },
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};