const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Generate simple token
const generateToken = (userId) => {
  return `token-${userId}-${Date.now()}`;
};

// Generate refresh token
const generateRefreshToken = () => {
  return `refresh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Save refresh token to database
const saveRefreshToken = async (userId, token, expiresAt) => {
  const { query } = require("../config/database");
  const sql = `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES (?, ?, ?)
  `;
  await query(sql, [userId, token, expiresAt]);
};

// Validate refresh token
const validateRefreshToken = async (token) => {
  const { query } = require("../config/database");
  const sql = `
    SELECT rt.*, u.id, u.name, u.email, u.username, u.wallet_address, u.profile_completed, u.email_verified
    FROM refresh_tokens rt
    JOIN users u ON rt.user_id = u.id
    WHERE rt.token = ? AND rt.expires_at > NOW()
  `;
  const tokens = await query(sql, [token]);
  return tokens[0] || null;
};

// Delete refresh token
const deleteRefreshToken = async (token) => {
  const { query } = require("../config/database");
  const sql = "DELETE FROM refresh_tokens WHERE token = ?";
  await query(sql, [token]);
};

// Route: POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password, walletAddress } = req.body;

    // Validasi input
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 8 karakter",
      });
    }

    // Cek apakah email sudah terdaftar
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Cek apakah username sudah terdaftar
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username sudah digunakan",
      });
    }

    // Buat user baru di database
    const userId = await User.create({
      name,
      username,
      email,
      password,
      walletAddress,
    });

    // Ambil data user yang baru dibuat
    const newUser = await User.findById(userId);

    // Generate token
    const token = generateToken(newUser.id);
    const refreshToken = generateToken(newUser.id);

    // Remove password from response
    const userWithoutPassword = User.sanitizeUser(newUser);

    console.log(`✅ User registered successfully: ${email} (ID: ${userId})`);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: {
        user: userWithoutPassword,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Route: POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/username dan password wajib diisi",
      });
    }

    // Cari user berdasarkan email atau username
    const user = await User.findByEmailOrUsername(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email/username atau password salah",
      });
    }

    // Verifikasi password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email/username atau password salah",
      });
    }

    // Generate token
    const token = generateToken(user.id);
    
    // Generate refresh token if rememberMe is true
    let refreshToken = null;
    if (rememberMe) {
      refreshToken = generateRefreshToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
      await saveRefreshToken(user.id, refreshToken, expiresAt);
    }

    // Remove password from response
    const userWithoutPassword = User.sanitizeUser(user);

    console.log(`✅ User logged in successfully: ${user.email} (ID: ${user.id})`);

    res.json({
      success: true,
      message: "Login berhasil",
      data: {
        user: userWithoutPassword,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Route: GET /api/auth/me
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
    if (!token.startsWith("token-")) {
      return res.status(401).json({
        success: false,
        message: "Token tidak valid",
      });
    }

    // Extract user ID from token
    const userId = parseInt(token.split("-")[1]);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Remove password from response
    const userWithoutPassword = User.sanitizeUser(user);

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Route: POST /api/auth/refresh
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token diperlukan",
      });
    }

    // Validate refresh token
    const tokenData = await validateRefreshToken(refreshToken);
    if (!tokenData) {
      return res.status(401).json({
        success: false,
        message: "Refresh token tidak valid atau sudah expired",
      });
    }

    // Generate new access token
    const newToken = generateToken(tokenData.user_id);
    
    // Remove password from response
    const userWithoutPassword = User.sanitizeUser(tokenData);

    console.log(`✅ Token refreshed for user: ${tokenData.email} (ID: ${tokenData.user_id})`);

    res.json({
      success: true,
      message: "Token berhasil di-refresh",
      data: {
        user: userWithoutPassword,
        token: newToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// Route: POST /api/auth/logout
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
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

module.exports = router;
