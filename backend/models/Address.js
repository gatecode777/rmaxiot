// backend/models/Address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    
    shippingAddress: {
      type: String,
      required: true,
      trim: true,
    },
    
    landmark: {
      type: String,
      trim: true,
    },
    
    pinCode: {
      type: String,
      required: true,
      trim: true,
    },
    
    city: {
      type: String,
      required: true,
      trim: true,
    },
    
    state: {
      type: String,
      required: true,
      trim: true,
    },
    
    country: {
      type: String,
      default: 'India',
      trim: true,
    },
    
    isDefault: {
      type: Boolean,
      default: false,
    },
    
    deliveryInstructions: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
addressSchema.index({ user: 1 });
addressSchema.index({ user: 1, isDefault: 1 });

// Ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    // Remove default from other addresses for this user
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
});

module.exports = mongoose.model('Address', addressSchema);