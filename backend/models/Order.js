// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // User reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Order number (auto-generated)
    orderNumber: {
      type: String,
      unique: true,
    },

    // Order items - SNAPSHOT of product data at time of order
    items: [
      {
        // Product reference (for admin to view product)
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },

        // Product snapshot (won't change if product details change)
        productSnapshot: {
          name: String,
          slug: String,
          image: String, // First image
          category: String,
        },

        // Selected color
        selectedColor: {
          name: String,
          hexCode: String,
        },

        // Pricing at time of order
        price: {
          mrp: Number,
          selling: Number,
          discount: Number,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],

    // Delivery address - SNAPSHOT (won't change if user updates address)
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      mobileNumber: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      shippingAddress: {
        type: String,
        required: true,
      },
      landmark: String,
      pinCode: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: 'India',
      },
      deliveryInstructions: String,
    },

    // Payment details
    payment: {
      method: {
        type: String,
        enum: ['card', 'netbanking', 'upi', 'other_upi', 'emi', 'cod'],
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
      },
      transactionId: String,
      paidAt: Date,
    },

    // Order pricing
    pricing: {
      subtotal: {
        type: Number,
        required: true,
      },
      deliveryCharges: {
        type: Number,
        default: 0,
      },
      tax: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },

    // Order status
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },

    // Status history
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        comment: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Admin',
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Delivery tracking
    tracking: {
      trackingNumber: String,
      carrier: String,
      estimatedDelivery: Date,
      actualDelivery: Date,
    },

    // Additional info
    notes: String,
    
    // Cancellation
    cancellation: {
      reason: String,
      cancelledBy: {
        type: String,
        enum: ['user', 'admin'],
      },
      cancelledAt: Date,
    },

    // Timestamps
    placedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    // Generate order number: RM + timestamp + random
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `RM${timestamp}${random}`;
  }

  // Add initial status to history
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      comment: 'Order placed',
      updatedAt: new Date(),
    });
  }
});

// Method to update status
orderSchema.methods.updateStatus = function (newStatus, comment, adminId) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    comment: comment || `Status changed to ${newStatus}`,
    updatedBy: adminId,
    updatedAt: new Date(),
  });
};

// Virtual for total items
orderSchema.virtual('totalItems').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Ensure virtuals are included
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);