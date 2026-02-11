// backend/routes/wishlist.js
const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlist,
  getWishlistCount,
  moveToCart,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/userAuth');

// All routes require authentication
router.use(protect);

// Get wishlist
router.get('/', getWishlist);

// Get wishlist count
router.get('/count', getWishlistCount);

// Check if product in wishlist
router.get('/check/:productId', checkWishlist);

// Add to wishlist
router.post('/add', addToWishlist);

// Remove from wishlist
router.delete('/remove/:productId', removeFromWishlist);

// Clear wishlist
router.delete('/clear', clearWishlist);

// Move to cart
router.post('/move-to-cart/:productId', moveToCart);

module.exports = router;