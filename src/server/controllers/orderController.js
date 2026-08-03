// backend/controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Address = require('../models/Address');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      items, // Array of { productId, quantity, selectedColor }
      addressId,
      paymentMethod,
    } = req.body;

    // Validate input
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items provided',
      });
    }

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required',
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required',
      });
    }

    // Get address details
    const address = await Address.findOne({
      _id: addressId,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    // Prepare order items with product snapshots
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      // Get product details
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }

      if (product.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`,
        });
      }

      // Check stock
      if (product.stock.available < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock.available} available.`,
        });
      }

      // Get selected color details
      let selectedColor = null;
      if (item.selectedColor) {
        const colorObj = product.specifications?.colors?.find(
          (c) => c.name === item.selectedColor
        );
        if (colorObj) {
          selectedColor = {
            name: colorObj.name,
            hexCode: colorObj.hexCode,
          };
        }
      }

      // Calculate item subtotal
      const itemSubtotal = product.price.selling * item.quantity;
      subtotal += itemSubtotal;

      // Create order item with snapshot
      orderItems.push({
        productId: product._id,
        productSnapshot: {
          name: product.name,
          slug: product.slug,
          image: product.images?.[0] || '',
          category: product.category?.name || product.category || '',
        },
        selectedColor,
        price: {
          mrp: product.price.mrp,
          selling: product.price.selling,
          discount: product.price.discount || 0,
        },
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });

      // Update product stock
      product.stock.available -= item.quantity;
      
      // Update stock status based on availability
      if (product.stock.available === 0) {
        product.stock.status = 'Out of Stock';
      } else if (product.stock.available <= product.stock.lowStockAlert) {
        product.stock.status = 'Limited Stock';
      }
      
      await product.save();
    }

    // Calculate delivery charges
    const deliveryCharges = subtotal >= 5000 ? 0 : 250;

    // Calculate total
    const total = subtotal + deliveryCharges;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress: {
        fullName: address.fullName,
        mobileNumber: address.mobileNumber,
        email: address.email,
        shippingAddress: address.shippingAddress,
        landmark: address.landmark,
        pinCode: address.pinCode,
        city: address.city,
        state: address.state,
        country: address.country,
        deliveryInstructions: address.deliveryInstructions,
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'completed',
        paidAt: paymentMethod !== 'cod' ? new Date() : null,
      },
      pricing: {
        subtotal,
        deliveryCharges,
        tax: 0,
        discount: 0,
        total,
      },
      status: 'confirmed',
    });

    // Clear cart items that were ordered
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      const orderedProductIds = items.map((item) => item.productId.toString());
      cart.items = cart.items.filter(
        (cartItem) => !orderedProductIds.includes(cartItem.product.toString())
      );
      await cart.save();
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalOrders: count,
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    // Update order status
    order.status = 'cancelled';
    order.cancellation = {
      reason: reason || 'Cancelled by user',
      cancelledBy: 'user',
      cancelledAt: new Date(),
    };

    order.statusHistory.push({
      status: 'cancelled',
      comment: reason || 'Cancelled by user',
      updatedAt: new Date(),
    });

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock.available += item.quantity;
        
        // Update stock status
        if (product.stock.available > product.stock.lowStockAlert) {
          product.stock.status = 'In Stock';
        } else if (product.stock.available > 0) {
          product.stock.status = 'Limited Stock';
        }
        
        await product.save();
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message,
    });
  }
};

// ==================== ADMIN ENDPOINTS ====================

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query['payment.status'] = paymentStatus;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.mobileNumber': { $regex: search, $options: 'i' } },
      ];
    }

    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email mobileNumber')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalOrders: count,
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, comment, trackingNumber, carrier } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    // Update status
    order.updateStatus(status, comment, req.admin._id);

    // Update tracking if provided
    if (trackingNumber || carrier) {
      order.tracking = {
        ...order.tracking,
        trackingNumber: trackingNumber || order.tracking?.trackingNumber,
        carrier: carrier || order.tracking?.carrier,
      };
    }

    // Set delivery date if delivered
    if (status === 'delivered' && !order.tracking?.actualDelivery) {
      order.tracking = {
        ...order.tracking,
        actualDelivery: new Date(),
      };
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

// @desc    Get order statistics (Admin)
// @route   GET /api/admin/orders/stats
// @access  Private/Admin
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    // Calculate total revenue (delivered orders only)
    const revenueData = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message,
    });
  }
};
