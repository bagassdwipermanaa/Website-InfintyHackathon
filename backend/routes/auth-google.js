const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "blockrights-secret-2024";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Route: POST /api/auth/google
router.post("/google", async (req, res) => {
  try {
    const { email, name, googleId, picture } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: "Email dan Google ID diperlukan",
      });
    }

    // Cek apakah user sudah terdaftar
    let user = await User.findByEmail(email);

    if (user) {
      // User sudah ada, update google_id jika belum ada
      if (!user.google_id) {
        await User.updateGoogleId(user.id, googleId);
      }

      // Update last login
      try {
        await User.updateLastLogin(user.id);
      } catch (_) {}

      // Generate token
      const token = generateToken(user.id);
      const refreshToken = generateToken(user.id);

      // Remove password from response
      const userWithoutPassword = User.sanitizeUser(user);

      console.log(`✅ Google login successful: ${email} (ID: ${user.id})`);

      return res.json({
        success: true,
        message: "Login dengan Google berhasil",
        data: {
          user: userWithoutPassword,
          token,
          refreshToken,
        },
      });
    } else {
      // User belum ada, buat user baru
      // Generate username dari email
      const username = email.split("@")[0] + "_" + Math.random().toString(36).substring(2, 7);
      
      // Create user dengan password random (tidak akan digunakan karena login via Google)
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const userId = await User.create({
        name: name || email.split("@")[0],
        username: username,
        email: email,
        password: randomPassword,
        walletAddress: null,
      });

      // Update google_id
      await User.updateGoogleId(userId, googleId);

      // Ambil user yang baru dibuat
      const newUser = await User.findById(userId);

      // Update last login
      try {
        await User.updateLastLogin(userId);
      } catch (_) {}

      // Generate token
      const token = generateToken(userId);
      const refreshToken = generateToken(userId);

      // Remove password from response
      const userWithoutPassword = User.sanitizeUser(newUser);

      console.log(`✅ New user registered via Google: ${email} (ID: ${userId})`);

      return res.status(201).json({
        success: true,
        message: "Registrasi dengan Google berhasil",
        data: {
          user: userWithoutPassword,
          token,
          refreshToken,
        },
      });
    }
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat autentikasi dengan Google",
    });
  }
});

module.exports = router;

