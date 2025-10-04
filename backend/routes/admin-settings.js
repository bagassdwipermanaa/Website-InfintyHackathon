const express = require("express");
const router = express.Router();
const SystemSettings = require("../models/SystemSettings");
const adminAuth = require("../middleware/adminAuth");

// Apply admin auth middleware to all routes
router.use(adminAuth);

// Get system settings
router.get("/", async (req, res) => {
  try {
    const settings = await SystemSettings.getAll();

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update system settings
router.put("/", async (req, res) => {
  try {
    const settings = req.body;

    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      await SystemSettings.update(key, value);
    }

    // Log activity
    try {
      const ActivityLog = require("../models/ActivityLog");
      await ActivityLog.create({
        adminId: req.admin?.id,
        action: "settings_update",
        description: "System settings updated",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
    } catch (logError) {
      console.warn("Activity log failed:", logError.message);
    }

    res.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
