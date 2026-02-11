const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  toggleFeatured,
  updateProductStatus,
  getProductStats,
} = require('../controllers/adminProductController');
const { protect, authorize } = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(protect);

// Get product statistics
router.get('/stats', getProductStats);

// Get all products
router.get('/', authorize('products.view'), getAllProducts);

// Create product with image upload (up to 10 images)
router.post(
  '/',
  authorize('products.create'),
  upload.array('images', 10),
  createProduct
);

// Get single product
router.get('/:id', authorize('products.view'), getProductById);

// Update product with optional new images
router.put(
  '/:id',
  authorize('products.edit'),
  upload.array('images', 10),
  updateProduct
);

// Delete product
router.delete('/:id', authorize('products.delete'), deleteProduct);

// Delete specific product image
router.delete(
  '/:id/images/:filename',
  authorize('products.edit'),
  deleteProductImage
);

// Toggle featured status
router.put('/:id/toggle-featured', authorize('products.edit'), toggleFeatured);

// Update product status
router.put('/:id/status', authorize('products.edit'), updateProductStatus);

module.exports = router;