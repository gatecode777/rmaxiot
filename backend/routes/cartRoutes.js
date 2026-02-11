// backend/routes/cart.js
const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount,
} = require('../controllers/cartController');
const { protect } = require('../middleware/userAuth'); // Use user auth, not admin auth

// All routes require authentication
router.use(protect);

// Get cart
router.get('/', getCart);

// Get cart item count
router.get('/count', getCartCount);

// Add to cart
router.post('/add', addToCart);

// Update cart item
router.put('/update', updateCartItem);

// Remove from cart
router.delete('/remove/:productId', removeFromCart);

// Clear cart
router.delete('/clear', clearCart);

module.exports = router;