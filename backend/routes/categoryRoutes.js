// backend/routes/category.js
const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleActive,
  toggleFeatured,
  // updateAllProductCounts,
  deleteCategoryImage,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/adminAuth.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads/categories directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads', 'categories');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for category image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Public routes
router.get('/', getAllCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategory);

// Admin routes (protected)
router.post('/', protect, authorize('admin', 'super_admin'), upload.single('image'), createCategory);
router.put('/:id', protect, authorize('admin', 'super_admin'), upload.single('image'), updateCategory);
router.delete('/:id', protect, authorize('admin', 'super_admin'), deleteCategory);
router.put('/:id/toggle-active', protect, authorize('admin', 'super_admin'), toggleActive);
router.put('/:id/toggle-featured', protect, authorize('admin', 'super_admin'), toggleFeatured);
// router.post('/update-counts', protect, authorize('admin', 'super_admin'), updateAllProductCounts);
router.delete('/:id/image', protect, authorize('admin', 'super_admin'), deleteCategoryImage);

module.exports = router;