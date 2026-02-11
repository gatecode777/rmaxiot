// backend/controllers/wishlistController.js
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name slug price images thumbnail specifications stock status rating',
      });

    if (!wishlist) {
      // Create empty wishlist if doesn't exist
      wishlist = await Wishlist.create({
        user: req.user._id,
        items: [],
      });
    }

    // Filter out items where product is null or inactive
    wishlist.items = wishlist.items.filter(
      item => item.product && item.product.status === 'active'
    );

    res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message,
    });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist/add
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Validate product exists and is active
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Product is not available',
      });
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        items: [],
      });
    }

    // Check if product already in wishlist
    const existingItem = wishlist.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist',
      });
    }

    // Add product to wishlist
    wishlist.items.push({
      product: productId,
    });

    await wishlist.save();

    // Populate and return
    wishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'items.product',
      select: 'name slug price images thumbnail specifications stock status rating',
    });

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist,
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist',
      error: error.message,
    });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    // Remove item
    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== productId
    );

    await wishlist.save();

    // Populate and return
    const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'items.product',
      select: 'name slug price images thumbnail specifications stock status rating',
    });

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist: updatedWishlist,
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist',
      error: error.message,
    });
  }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist/clear
// @access  Private
exports.clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    wishlist.items = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared',
      wishlist,
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist',
      error: error.message,
    });
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
exports.checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    const inWishlist = wishlist 
      ? wishlist.items.some(item => item.product.toString() === productId)
      : false;

    res.status(200).json({
      success: true,
      inWishlist,
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist',
      error: error.message,
    });
  }
};

// @desc    Get wishlist count
// @route   GET /api/wishlist/count
// @access  Private
exports.getWishlistCount = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    const count = wishlist ? wishlist.items.length : 0;

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Get wishlist count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wishlist count',
      error: error.message,
    });
  }
};

// @desc    Move item from wishlist to cart
// @route   POST /api/wishlist/move-to-cart/:productId
// @access  Private
exports.moveToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const Cart = require('../models/Cart');

    // Get wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    // Check if product in wishlist
    const wishlistItem = wishlist.items.find(
      item => item.product.toString() === productId
    );

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not in wishlist',
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    
    if (!product || product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Product not available',
      });
    }

    // Add to cart
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    // Check if already in cart
    const cartItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!cartItem) {
      cart.items.push({
        product: productId,
        quantity: 1,
        priceAtAdd: product.price.selling,
      });
      await cart.save();
    }

    // Remove from wishlist
    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== productId
    );
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product moved to cart',
    });
  } catch (error) {
    console.error('Move to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to move to cart',
      error: error.message,
    });
  }
};