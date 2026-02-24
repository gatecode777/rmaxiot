// backend/routes/adminOrder.js - NEW FILE
const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/adminAuth');

// All admin routes (protected + admin only)
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.get('/stats', protect, authorize('admin'), getOrderStats);

module.exports = router;