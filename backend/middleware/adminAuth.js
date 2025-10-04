const jwt = require("jsonwebtoken");

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token (simple implementation - in production use proper JWT)
    if (token === "admin-token-123") {
      // Mock admin data for now
      req.admin = {
        id: 1,
        username: "admin",
        full_name: "Administrator",
      };
      return next();
    }

    // If token is not valid
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

module.exports = adminAuth;
