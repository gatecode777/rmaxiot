// backend/controllers/publicProductController.js
// UPDATED - Controller for public product endpoints with category ID filtering

const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get All Active Products (PUBLIC)
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      category = '',
      isBestSeller,
      isNewArrival,
      isFeatured,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    // Build query - Only show active products
    const query = { status: 'active' };

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'description.short': { $regex: search, $options: 'i' } },
        { 'description.long': { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter - UPDATED to support multiple category IDs
    if (category && category !== 'all') {
      // Handle multiple categories (comma-separated IDs)
      const categoryIds = category.split(',').filter(Boolean);
      
      if (categoryIds.length > 0) {
        query.category = { $in: categoryIds };
      }
    }

    // Feature filters
    if (isBestSeller === 'true') {
      query.isBestSeller = true;
    }

    if (isNewArrival === 'true') {
      query.isNewArrival = true;
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    // Execute query with pagination and populate category
    const products = await Product.find(query)
      .populate('category', 'name slug') // Populate category details
      .select('-createdBy -updatedBy') // Exclude admin fields
      .sort(sort)
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
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

// @desc    Get Product by ID (PUBLIC)
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      status: 'active', // Only active products
    })
      .populate('category', 'name slug')
      .select('-createdBy -updatedBy');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Increment view count
    product.views = (product.views || 0) + 1;
    await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

// @desc    Get Product by Slug (PUBLIC)
// @route   GET /api/products/slug/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      slug: slug,
      status: 'active', // Only active products
    })
      .populate('category', 'name slug')
      .select('-createdBy -updatedBy');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Increment view count
    product.views = (product.views || 0) + 1;
    await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

// @desc    Get Featured Products (PUBLIC)
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find({
      status: 'active',
      isFeatured: true,
    })
      .populate('category', 'name slug')
      .select('-createdBy -updatedBy')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message,
    });
  }
};

// @desc    Get Best Sellers (PUBLIC)
// @route   GET /api/products/best-sellers
// @access  Public
exports.getBestSellers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find({
      status: 'active',
      isBestSeller: true,
    })
      .populate('category', 'name slug')
      .select('-createdBy -updatedBy')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Get best sellers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch best sellers',
      error: error.message,
    });
  }
};

// @desc    Get New Arrivals (PUBLIC)
// @route   GET /api/products/new-arrivals
// @access  Public
exports.getNewArrivals = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find({
      status: 'active',
      isNewArrival: true,
    })
      .populate('category', 'name slug')
      .select('-createdBy -updatedBy')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch new arrivals',
      error: error.message,
    });
  }
};

// @desc    Get Products by Category (PUBLIC) - UPDATED
// @route   GET /api/products/category/:categoryIdOrSlug
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryIdOrSlug } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Find category by ID or slug
    let category;
    if (categoryIdOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a valid ObjectId
      category = await Category.findById(categoryIdOrSlug);
    } else {
      // It's a slug
      category = await Category.findOne({ slug: categoryIdOrSlug });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const products = await Product.find({
      status: 'active',
      category: category._id,
    })
      .populate('category', 'name slug')
      .select('-createdBy -updatedBy')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments({
      status: 'active',
      category: category._id,
    });

    res.status(200).json({
      success: true,
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count,
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
      },
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category',
      error: error.message,
    });
  }
};

// @desc    Search Products (PUBLIC)
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const searchQuery = {
      status: 'active',
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { 'description.short': { $regex: q, $options: 'i' } },
        { 'description.long': { $regex: q, $options: 'i' } },
        { subcategory: { $regex: q, $options: 'i' } },
        { 'seo.keywords': { $regex: q, $options: 'i' } },
      ],
    };

    const products = await Product.find(searchQuery)
      .populate('category', 'name slug')
      .select('-createdBy -updatedBy')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalProducts: count,
      searchQuery: q,
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message,
    });
  }
};