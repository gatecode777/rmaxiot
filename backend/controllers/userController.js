const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const userController = {
  // REGISTER
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Validation
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please fill all required fields",
        });
      }

      // Check existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = generateToken(user._id);

      // Response
      return res.status(201).json({
        success: true,
        message: "Registration successful",
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          profile: user.profile,
        },
      });
    } catch (error) {
      console.error("Register Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // LOGIN
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user + include password
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your account is disabled. Please contact admin.",
        });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate token
      const token = generateToken(user._id);

      // Response
      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          profile: user.profile,
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // LOGOUT
  logout: async (req, res) => {
    res.json({ 
      success: true,
      message: "Logged out successfully" 
    });
  },

  // GET PROFILE
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          profile: user.profile,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Get Profile Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // UPDATE PROFILE
  updateProfile: async (req, res) => {
    try {
      const { firstName, lastName, phone } = req.body;
      const userId = req.user._id;

      // Find user
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update fields
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone !== undefined) user.phone = phone;

      // Handle profile image upload
      if (req.file) {
        // Delete old profile image if exists
        if (user.profile) {
          const oldImagePath = path.join(__dirname, "..", "uploads", "profiles", user.profile);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        // Set new profile image
        user.profile = req.file.filename;
      }

      await user.save();

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          profile: user.profile,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      console.error("Update Profile Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // CHANGE PASSWORD
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user._id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Please provide current and new password",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 8 characters",
        });
      }

      // Find user with password
      const user = await User.findById(userId).select("+password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change Password Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // DELETE PROFILE IMAGE
  deleteProfileImage: async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.profile) {
        // Delete image file
        const imagePath = path.join(__dirname, "..", "uploads", "profiles", user.profile);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }

        // Update user
        user.profile = "";
        await user.save();
      }

      res.json({
        success: true,
        message: "Profile image deleted successfully",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          profile: user.profile,
        },
      });
    } catch (error) {
      console.error("Delete Profile Image Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};

module.exports = userController;