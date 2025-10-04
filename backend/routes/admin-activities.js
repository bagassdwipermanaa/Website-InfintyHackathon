const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");
const adminAuth = require("../middleware/adminAuth");

// Apply admin auth middleware to all routes
router.use(adminAuth);

// Get all activities with pagination and filters
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filter = req.query.filter || "all";
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    let whereClause = "";
    let params = [];

    // Build filter conditions
    if (filter !== "all") {
      switch (filter) {
        case "login":
          whereClause =
            "WHERE action IN ('user_login', 'admin_login', 'user_logout', 'admin_logout')";
          break;
        case "artwork":
          whereClause =
            "WHERE action IN ('artwork_upload', 'artwork_verify', 'artwork_reject')";
          break;
        case "profile":
          whereClause = "WHERE action IN ('profile_update', 'password_change')";
          break;
        case "admin":
          whereClause = "WHERE admin_id IS NOT NULL";
          break;
        default:
          whereClause = "";
      }
    }

    // Add search condition
    if (search) {
      const searchCondition = "description LIKE ?";
      if (whereClause) {
        whereClause += ` AND ${searchCondition}`;
      } else {
        whereClause = `WHERE ${searchCondition}`;
      }
      params.push(`%${search}%`);
    }

    // Get activities with user/admin names
    const activitiesQuery = `
      SELECT 
        al.id, al.user_id, al.admin_id, al.action, al.description, 
        al.ip_address, al.user_agent, al.created_at, al.metadata,
        u.name as user_name,
        a.username as admin_name
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      LEFT JOIN admins a ON al.admin_id = a.id
      ${whereClause}
      ORDER BY al.created_at DESC 
      LIMIT ? OFFSET ?
    `;

    const activities = await ActivityLog.query(activitiesQuery, [
      ...params,
      limit,
      offset,
    ]);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM activity_logs al ${whereClause}`;
    const countResult = await ActivityLog.query(countQuery, params);
    const total = countResult[0].total;
    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      },
    });
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
