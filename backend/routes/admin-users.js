const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const Artwork = require("../models/Artwork");
const adminAuth = require("../middleware/adminAuth");

// Apply admin auth middleware to all routes
router.use(adminAuth);

// Get all users with pagination and search
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    let whereClause = "";
    let params = [];

    if (search) {
      whereClause = "WHERE name LIKE ? OR email LIKE ? OR username LIKE ?";
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    // Get users
    const usersQuery = `
      SELECT 
        id, name, username, email, is_active, last_login, created_at,
        profile_completed, email_verified, bio, website, social_links, phone, address
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;

    const users = await User.query(usersQuery, [...params, limit, offset]);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const countResult = await User.query(countQuery, params);
    const total = countResult[0].total;
    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get user detail by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Use model helper to avoid column mismatch with different schemas
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Stats and recents guarded to prevent whole endpoint from failing
    let artworksCount = [{ count: 0 }];
    let activitiesCount = [{ count: 0 }];
    let recentActivities = [];
    let recentArtworks = [];

    try {
      artworksCount = await Artwork.query(
        "SELECT COUNT(*) as count FROM artworks WHERE user_id = ?",
        [userId]
      );
    } catch (_) {}

    try {
      activitiesCount = await ActivityLog.query(
        "SELECT COUNT(*) as count FROM activity_logs WHERE user_id = ?",
        [userId]
      );
    } catch (_) {}

    try {
      recentActivities = await ActivityLog.query(
        `SELECT action, description, created_at 
         FROM activity_logs 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT 5`,
        [userId]
      );
    } catch (_) {}

    try {
      recentArtworks = await Artwork.query(
        `SELECT title, status, created_at 
         FROM artworks 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT 5`,
        [userId]
      );
    } catch (_) {}

    const sanitized = User.sanitizeUser(user) || user;

    const userDetail = {
      ...sanitized,
      artworks_count: artworksCount[0]?.count ?? 0,
      activities_count: activitiesCount[0]?.count ?? 0,
      recent_activities: recentActivities,
      recent_artworks: recentArtworks,
    };

    res.json({
      success: true,
      data: userDetail,
    });
  } catch (error) {
    console.error("Get user detail error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Toggle user status
router.put("/:id/toggle-status", async (req, res) => {
  try {
    const userId = req.params.id;
    const { is_active } = req.body;

    const result = await User.query(
      "UPDATE users SET is_active = ? WHERE id = ?",
      [is_active, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Log activity
    try {
      await ActivityLog.create({
        adminId: req.admin?.id,
        action: "user_status_toggle",
        description: `User status changed to ${
          is_active ? "active" : "inactive"
        }`,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
    } catch (logError) {
      console.warn("Activity log failed:", logError.message);
    }

    res.json({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    console.error("Toggle user status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
