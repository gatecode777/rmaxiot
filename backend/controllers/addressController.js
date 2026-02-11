// backend/controllers/addressController.js
const Address = require('../models/Address');

// @desc    Get all addresses for user
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
      error: error.message,
    });
  }
};

// @desc    Get single address
// @route   GET /api/addresses/:id
// @access  Private
exports.getAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch address',
      error: error.message,
    });
  }
};

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
exports.createAddress = async (req, res) => {
  try {
    const {
      fullName,
      mobileNumber,
      email,
      shippingAddress,
      landmark,
      pinCode,
      city,
      state,
      country,
      isDefault,
      deliveryInstructions,
    } = req.body;

    // Validate required fields
    if (!fullName || !mobileNumber || !email || !shippingAddress || !pinCode || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if this is user's first address
    const addressCount = await Address.countDocuments({ user: req.user._id });
    const shouldBeDefault = addressCount === 0 || isDefault;

    const address = await Address.create({
      user: req.user._id,
      fullName,
      mobileNumber,
      email,
      shippingAddress,
      landmark,
      pinCode,
      city,
      state,
      country: country || 'India',
      isDefault: shouldBeDefault,
      deliveryInstructions,
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      address,
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create address',
      error: error.message,
    });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    let address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    const {
      fullName,
      mobileNumber,
      email,
      shippingAddress,
      landmark,
      pinCode,
      city,
      state,
      country,
      isDefault,
      deliveryInstructions,
    } = req.body;

    // Update fields
    address.fullName = fullName || address.fullName;
    address.mobileNumber = mobileNumber || address.mobileNumber;
    address.email = email || address.email;
    address.shippingAddress = shippingAddress || address.shippingAddress;
    address.landmark = landmark !== undefined ? landmark : address.landmark;
    address.pinCode = pinCode || address.pinCode;
    address.city = city || address.city;
    address.state = state || address.state;
    address.country = country || address.country;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;
    address.deliveryInstructions = deliveryInstructions !== undefined ? deliveryInstructions : address.deliveryInstructions;

    await address.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address,
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message,
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    const wasDefault = address.isDefault;
    await address.deleteOne();

    // If deleted address was default, make another one default
    if (wasDefault) {
      const nextAddress = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 });
      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message,
    });
  }
};

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated',
      address,
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default address',
      error: error.message,
    });
  }
};