const express = require("express");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// File untuk menyimpan data persistent
const DATA_FILE = path.join(__dirname, "../data/users.json");

// Load users dari file
const loadUsers = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading users:", error);
  }
  return [
    {
      id: 1,
      name: "Admin User",
      username: "admin",
      email: "admin@blockrights.com",
      password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8J8K8K8K8K", // admin123
      wallet_address: null,
      profile_completed: true,
      email_verified: true,
      created_at: new Date().toISOString(),
    },
  ];
};

// Save users ke file
const saveUsers = (users) => {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    console.log(`💾 Saved ${users.length} users to ${DATA_FILE}`);
  } catch (error) {
    console.error("Error saving users:", error);
  }
};

// Load users saat startup
let users = loadUsers();
console.log(`📊 Loaded ${users.length} users from persistent storage`);

// Generate simple token
const generateToken = (userId) => {
  return `token-${userId}-${Date.now()}`;
};

// Route: POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password, walletAddress } = req.body;

    // Validasi input sederhana
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
    const existingEmail = users.find((user) => user.email === email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // Cek apakah username sudah terdaftar
    const existingUsername = users.find((user) => user.username === username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username sudah digunakan",
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Buat user baru
    const newUser = {
      id: users.length + 1,
      name,
      username,
      email,
      password: hashedPassword,
      wallet_address: walletAddress || null,
      profile_completed: false,
      email_verified: false,
      created_at: new Date().toISOString(),
    };

    users.push(newUser);

    // Save to persistent storage
    saveUsers(users);

    // Generate token
    const token = generateToken(newUser.id);
    const refreshToken = generateToken(newUser.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

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

    // Validasi input sederhana
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/username dan password wajib diisi",
      });
    }

    // Cari user berdasarkan email atau username
    const user = users.find((u) => u.email === email || u.username === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email/username atau password salah",
      });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email/username atau password salah",
      });
    }

    // Generate token
    const token = generateToken(user.id);
    const refreshToken = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

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
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

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

module.exports = router;
