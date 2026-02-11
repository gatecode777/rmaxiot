// backend/routes/address.js
const express = require('express');
const router = express.Router();
const {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require('../controllers/addressController');
const { protect } = require('../middleware/userAuth');

// All routes require authentication
router.use(protect);

// Get all addresses
router.get('/', getAddresses);

// Create new address
router.post('/', createAddress);

// Get single address
router.get('/:id', getAddress);

// Update address
router.put('/:id', updateAddress);

// Delete address
router.delete('/:id', deleteAddress);

// Set default address
router.put('/:id/default', setDefaultAddress);

module.exports = router;