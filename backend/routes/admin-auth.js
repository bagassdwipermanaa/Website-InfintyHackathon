const express = require("express");
const Admin = require("../models/Admin");
const ActivityLog = require("../models/ActivityLog");

const router = express.Router();

// Generate simple token
const generateToken = (adminId) => {
  return `admin-token-${adminId}-${Date.now()}`;
};

// Generate refresh token
const generateRefreshToken = () => {
  return `admin-refresh-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
};

// Save refresh token to database
const saveRefreshToken = async (adminId, token, expiresAt) => {
  const { query } = require("../config/database");
  const sql = `
    INSERT INTO admin_refresh_tokens (admin_id, token, expires_at)
    VALUES (?, ?, ?)
  `;
  await query(sql, [adminId, token, expiresAt]);
};

// Validate refresh token
const validateRefreshToken = async (token) => {
  const { query } = require("../config/database");
  const sql = `
    SELECT rt.*, au.id, au.username, au.email, au.full_name, au.role, au.is_active
    FROM admin_refresh_tokens rt
    JOIN admin_users au ON rt.admin_id = au.id
    WHERE rt.token = ? AND rt.expires_at > NOW()
  `;
  const tokens = await query(sql, [token]);
  return tokens[0] || null;
};

// Delete refresh token
const deleteRefreshToken = async (token) => {
  const { query } = require("../config/database");
  const sql = "DELETE FROM admin_refresh_tokens WHERE token = ?";
  await query(sql, [token]);
};

// Route: POST /api/admin/login
router.post("/login", async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi",
      });
    }

    // Cari admin berdasarkan username atau email
    const admin = await Admin.findByEmailOrUsername(username);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    // Cek apakah admin aktif
    if (!admin.is_active) {
      return res.status(401).json({
        success: false,
        message: "Akun admin tidak aktif",
      });
    }

    // Verifikasi password
    const isPasswordValid = await Admin.verifyPassword(
      password,
      admin.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    // Generate token
    const token = generateToken(admin.id);

    // Generate refresh token if rememberMe is true
    let refreshToken = null;
    if (rememberMe) {
      refreshToken = generateRefreshToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
      await saveRefreshToken(admin.id, refreshToken, expiresAt);
    }

    // Update last login
    await Admin.updateLastLogin(admin.id);

    // Log activity (temporarily disabled for debugging)
    try {
      await ActivityLog.create({
        adminId: admin.id,
        action: "admin_login",
        description: `Admin ${admin.username} logged in`,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
    } catch (logError) {
      console.warn("Activity log failed:", logError.message);
      // Continue with login even if logging fails
    }

    // Remove password from response
    const adminWithoutPassword = Admin.sanitizeAdmin(admin);

    console.log(
      `✅ Admin logged in successfully: ${admin.username} (ID: ${admin.id})`
    );

    res.json({
      success: true,
      message: "Login berhasil",
      data: {
        admin: adminWithoutPassword,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Route: GET /api/admin/me
router.get("/me", async (req, res) => {
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
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin tidak ditemukan",
      });
    }

    if (!admin.is_active) {
      return res.status(401).json({
        success: false,
        message: "Akun admin tidak aktif",
      });
    }

    // Remove password from response
    const adminWithoutPassword = Admin.sanitizeAdmin(admin);

    res.json({
      success: true,
      data: {
        admin: adminWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Get admin me error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Route: POST /api/admin/logout
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
    }

    res.json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

module.exports = router;
