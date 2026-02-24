// backend/routes/order.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { userProtect } = require('../middleware/userAuth');

// User routes (protected)
router.post('/', userProtect, createOrder);
router.get('/my-orders', userProtect, getMyOrders);
router.get('/:id', userProtect, getOrderById);
router.put('/:id/cancel', userProtect, cancelOrder);

module.exports = router;