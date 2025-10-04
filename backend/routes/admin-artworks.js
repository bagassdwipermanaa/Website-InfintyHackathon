const express = require("express");
const router = express.Router();
const Artwork = require("../models/Artwork");
const ActivityLog = require("../models/ActivityLog");
const adminAuth = require("../middleware/adminAuth");

// Apply admin auth middleware to all routes
router.use(adminAuth);

// Get all artworks with pagination and status filter
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || "all";
    const offset = (page - 1) * limit;

    let whereClause = "";
    let params = [];

    if (status !== "all") {
      whereClause = "WHERE a.status = ?";
      params.push(status);
    }

    // Get artworks with user info
    const artworksQuery = `
      SELECT 
        a.id, a.title, a.description, a.file_hash, a.file_type, 
        a.file_size, a.status, a.created_at,
        u.name as user_name, u.email as user_email
      FROM artworks a
      LEFT JOIN users u ON a.user_id = u.id
      ${whereClause}
      ORDER BY a.created_at DESC 
      LIMIT ? OFFSET ?
    `;

    const artworks = await Artwork.query(artworksQuery, [
      ...params,
      limit,
      offset,
    ]);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM artworks a ${whereClause}`;
    const countResult = await Artwork.query(countQuery, params);
    const total = countResult[0].total;
    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        artworks,
        pagination: {
          page,
          limit,
          total,
          pages,
        },
      },
    });
  } catch (error) {
    console.error("Get artworks error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update artwork status
router.put("/:id/status", async (req, res) => {
  try {
    const artworkId = req.params.id;
    const { status } = req.body;

    const result = await Artwork.query(
      "UPDATE artworks SET status = ? WHERE id = ?",
      [status, artworkId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Artwork not found",
      });
    }

    // Log activity
    try {
      await ActivityLog.create({
        adminId: req.admin?.id,
        action: "artwork_status_update",
        description: `Artwork status changed to ${status}`,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
    } catch (logError) {
      console.warn("Activity log failed:", logError.message);
    }

    res.json({
      success: true,
      message: "Artwork status updated successfully",
    });
  } catch (error) {
    console.error("Update artwork status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
