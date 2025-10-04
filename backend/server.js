const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { testConnection } = require("./config/database");
const authRoutes = require("./routes/auth-persistent");

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Terlalu banyak request, coba lagi nanti",
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "BlockRights API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error:", error);

  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan server",
    ...(process.env.NODE_ENV === "development" && { error: error.message }),
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection (optional for now)
    try {
      const dbConnected = await testConnection();
      if (dbConnected) {
        console.log("✅ Database connected successfully!");
      } else {
        console.log(
          "⚠️ Database connection failed, but server will continue..."
        );
      }
    } catch (dbError) {
      console.log("⚠️ Database connection failed, but server will continue...");
      console.log("💡 Make sure to setup database later");
    }

    // Start HTTP server
    app.listen(PORT, () => {
      console.log("🚀 BlockRights Backend Server Started!");
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Start the server
startServer();
