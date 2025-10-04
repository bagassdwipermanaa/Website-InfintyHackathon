const express = require("express");
const { body, validationResult } = require("express-validator");
const { User } = require("../models");
const { generateToken } = require("../middleware/auth");
const { getProfileCompleteness } = require("../middleware/profileChecker");
const { uploadAvatar, handleUploadError } = require("../middleware/upload");

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("walletAddress")
      .optional()
      .matches(/^0x[a-fA-F0-9]{40}$/)
      .withMessage("Invalid wallet address format"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { name, email, password, walletAddress } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          $or: [
            { email: email },
            ...(walletAddress ? [{ walletAddress: walletAddress }] : []),
          ],
        },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            existingUser.email === email
              ? "Email already registered"
              : "Wallet address already registered",
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        walletAddress: walletAddress || null,
      });

      // Generate token
      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated",
        });
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate token
      const token = generateToken(user);

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Wallet login
router.post(
  "/wallet-login",
  [
    body("walletAddress")
      .matches(/^0x[a-fA-F0-9]{40}$/)
      .withMessage("Invalid wallet address format"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { walletAddress } = req.body;

      // Find user by wallet address
      const user = await User.findOne({ where: { walletAddress } });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Wallet not registered. Please register first.",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated",
        });
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate token
      const token = generateToken(user);

      res.json({
        success: true,
        message: "Wallet login successful",
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      console.error("Wallet login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Get current user
router.get(
  "/me",
  require("../middleware/auth").authenticateToken,
  async (req, res) => {
    try {
      const profileCompleteness = getProfileCompleteness(req.user);
      
      res.json({
        success: true,
        user: req.user.toJSON(),
        profileCompleteness
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Check profile status for verification eligibility
router.get(
  "/profile-status",
  require("../middleware/auth").authenticateToken,
  async (req, res) => {
    try {
      const profileCompleteness = getProfileCompleteness(req.user);
      const requiredFields = ['name', 'email'];
      const missingRequired = requiredFields.filter(field => 
        !req.user[field] || req.user[field].trim() === ''
      );
      
      const canVerify = missingRequired.length === 0 && req.user.isActive;
      
      res.json({
        success: true,
        canVerify,
        profileCompleteness,
        missingRequired,
        isActive: req.user.isActive,
        recommendations: profileCompleteness.missingFields.filter(field => 
          !requiredFields.includes(field)
        )
      });
    } catch (error) {
      console.error("Get profile status error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Update profile
router.put(
  "/profile",
  require("../middleware/auth").authenticateToken,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("bio")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Bio must be less than 500 characters"),
    body("website").optional().isURL().withMessage("Invalid website URL"),
    body("socialLinks")
      .optional()
      .isObject()
      .withMessage("Social links must be an object"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { name, bio, website, socialLinks } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (bio) updateData.bio = bio;
      if (website) updateData.website = website;
      if (socialLinks) updateData.socialLinks = socialLinks;

      await req.user.update(updateData);

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: req.user.toJSON(),
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Upload avatar
router.post(
  "/avatar",
  require("../middleware/auth").authenticateToken,
  uploadAvatar,
  handleUploadError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Update user avatar
      await req.user.update({ avatar: req.file.path });

      res.json({
        success: true,
        message: "Avatar uploaded successfully",
        avatarUrl: req.file.path,
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Change password
router.put(
  "/change-password",
  require("../middleware/auth").authenticateToken,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("New password must be at least 8 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Check current password
      const isValidPassword = await req.user.comparePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      await req.user.update({ password: newPassword });

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Logout (client-side token removal)
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
