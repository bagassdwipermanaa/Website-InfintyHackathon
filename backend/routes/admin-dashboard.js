const express = require("express");
const User = require("../models/User");
const Artwork = require("../models/Artwork");
const ActivityLog = require("../models/ActivityLog");
const SystemSettings = require("../models/SystemSettings");

const router = express.Router();

// Middleware untuk verifikasi admin token
const verifyAdminToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token diperlukan",
      });
    }

    // Simple token verification
    if (!token.startsWith("admin-token-")) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid",
      });
    }

    // Extract admin ID from token
    const adminId = parseInt(token.split("-")[2]);
    const Admin = require("../models/Admin");
    const admin = await Admin.findById(adminId);

    if (!admin || !admin.is_active) {
      return res.status(401).json({
        success: false,
        message: "Admin tidak ditemukan atau tidak aktif",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin token verification error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};

// Route: GET /api/admin/dashboard/stats
router.get("/dashboard/stats", verifyAdminToken, async (req, res) => {
  try {
    // Get user statistics
    const userCount = await User.count();
    const activeUserCount = await User.countActive();

    // Get artwork statistics
    const artworkStats = await Artwork.getStatistics();

    // Get activity statistics
    const activityStats = await ActivityLog.getStatistics(30);

    // Get recent activities
    const recentActivities = await ActivityLog.getRecent(10);

    // Get recent artworks
    const recentArtworks = await Artwork.getRecent(10);

    res.json({
      success: true,
      data: {
        users: {
          total: userCount,
          active: activeUserCount,
        },
        artworks: artworkStats,
        activities: activityStats,
        recentActivities,
        recentArtworks,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Route: GET /api/admin/users
router.get("/users", verifyAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT id, name, username, email, role, is_active, last_login, created_at
      FROM users
    `;

    const params = [];

    if (search) {
      sql += " WHERE name LIKE ? OR email LIKE ? OR username LIKE ?";
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const users = await User.query(sql, params);
    const totalUsers = await User.count();

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalUsers,
          pages: Math.ceil(totalUsers / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Route: GET /api/admin/artworks
router.get("/artworks", verifyAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = null } = req.query;
    const offset = (page - 1) * limit;

    const artworks = await Artwork.findAll(
      parseInt(limit),
      parseInt(offset),
      status
    );
    const totalArtworks = await Artwork.count(status);

    res.json({
      success: true,
      data: {
        artworks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalArtworks,
          pages: Math.ceil(totalArtworks / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get artworks error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Route: PUT /api/admin/artworks/:id/status
router.put("/artworks/:id/status", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      !status ||
      !["pending", "verified", "rejected", "disputed"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid",
      });
    }

    const updated = await Artwork.updateStatus(id, status, req.admin.id);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Artwork tidak ditemukan",
      });
    }

    // Log activity
    await ActivityLog.create({
      adminId: req.admin.id,
      action: "artwork_status_update",
      description: `Admin ${req.admin.username} updated artwork ${id} status to ${status}`,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      metadata: { artworkId: id, newStatus: status },
    });

    res.json({
      success: true,
      message: "Status artwork berhasil diperbarui",
    });
  } catch (error) {
    console.error("Update artwork status error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Route: GET /api/admin/activities
router.get("/activities", verifyAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, userId = null } = req.query;
    const offset = (page - 1) * limit;

    const activities = await ActivityLog.findAll(
      parseInt(limit),
      parseInt(offset),
      userId
    );
    const totalActivities = await ActivityLog.count(userId);

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalActivities,
          pages: Math.ceil(totalActivities / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Route: GET /api/admin/settings
router.get("/settings", verifyAdminToken, async (req, res) => {
  try {
    const settings = await SystemSettings.getAll();

    res.json({
      success: true,
      data: { settings },
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Route: PUT /api/admin/settings
router.put("/settings", verifyAdminToken, async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== "object") {
      return res.status(400).json({
        success: false,
        message: "Data settings tidak valid",
      });
    }

    await SystemSettings.bulkUpdate(settings);

    // Log activity
    await ActivityLog.create({
      adminId: req.admin.id,
      action: "settings_update",
      description: `Admin ${req.admin.username} updated system settings`,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      metadata: { updatedSettings: Object.keys(settings) },
    });

    res.json({
      success: true,
      message: "Settings berhasil diperbarui",
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

module.exports = router;
