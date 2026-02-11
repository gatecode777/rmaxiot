const router = require("express").Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/userAuth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads/profiles directory if it doesn't exist
const uploadsDir = path.join(__dirname, "..", "public", "uploads", "profiles");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for profile image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// PUBLIC ROUTES
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// PROTECTED ROUTES (require authentication)
router.get("/profile", protect, userController.getProfile);
router.put("/profile", protect, upload.single("profile"), userController.updateProfile);
router.put("/change-password", protect, userController.changePassword);
router.delete("/profile-image", protect, userController.deleteProfileImage);

module.exports = router;