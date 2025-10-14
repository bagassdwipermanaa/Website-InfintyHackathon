const express = require("express");
const crypto = require("crypto");
const Artwork = require("../models/Artwork");
const ActivityLog = require("../models/ActivityLog");

const router = express.Router();
// GET /api/artworks/by-hash/:hash - detail artwork by hash
router.get("/by-hash/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const item = await Artwork.findByHash(hash);
    if (!item) {
      return res.status(404).json({ success: false, message: "Karya tidak ditemukan" });
    }

    res.json({
      success: true,
      isValid: true,
      artwork: {
        id: String(item.id),
        title: item.title,
        description: item.description,
        creator: { name: item.user_name },
        fileHash: item.file_hash,
        createdAt: item.created_at,
        status: item.status,
      },
    });
  } catch (error) {
    console.error("Get artwork by hash error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
// GET /api/artworks - list artworks for current user (with pagination)
router.get("/", async (req, res) => {
  try {
    const userId = getUserIdFromAuthHeader(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Token tidak valid" });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = (page - 1) * limit;

    const items = await Artwork.findByUserId(userId, limit, offset);
    const total = items.length;
    const pages = Math.ceil(total / limit);

    console.log('📦 Artworks data from DB:', items.map(a => ({
      id: a.id,
      user_id: a.user_id,
      userId: a.userId,
      title: a.title
    })));

    res.json({
      success: true,
      data: {
        artworks: items,
        pagination: { page, limit, total, pages },
      },
    });
  } catch (error) {
    console.error("List user artworks error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Public endpoint: list verified artworks (excluding purchased ones)
router.get("/public", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = (page - 1) * limit;

    // Get verified artworks that are NOT purchased (don't have "(Dibeli)" in title)
    const items = await Artwork.findPublicVerified(limit, offset);
    const total = await Artwork.countPublicVerified();
    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        artworks: items,
        pagination: { page, limit, total, pages },
      },
    });
  } catch (error) {
    console.error("List public verified artworks error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Helper: extract userId from JWT or simple token format
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "blockrights-secret-2024";

function getUserIdFromAuthHeader(req) {
  const authHeader = req.headers["authorization"];
  
  console.log("🔑 Auth Header:", authHeader ? "Present" : "Missing");
  
  if (!authHeader) return null;
  
  const parts = authHeader.split(" ");
  const token = parts.length === 2 ? parts[1] : parts[0];
  
  if (!token) {
    console.log("❌ No token found");
    return null;
  }
  
  console.log("🎫 Token preview:", token.substring(0, 20) + "...");
  
  // Try JWT first
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && decoded.id) {
      console.log("✅ JWT valid, user ID:", decoded.id);
      return decoded.id;
    }
  } catch (error) {
    console.log("⚠️ JWT verification failed:", error.message);
    // Not a valid JWT, try old format
  }
  
  // Try old format: token-<id>-timestamp
  if (token.startsWith("token-")) {
    const segments = token.split("-");
    const idStr = segments[1];
    const userId = parseInt(idStr, 10);
    if (!Number.isNaN(userId)) {
      console.log("✅ Old format token, user ID:", userId);
      return userId;
    }
  }
  
  console.log("❌ Token format not recognized");
  return null;
}

// POST /api/artworks/register - register metadata of an uploaded file (client-hashed)
router.post("/register", async (req, res) => {
  try {
    const userId = getUserIdFromAuthHeader(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Token tidak valid" });
    }

    const { title, description, fileSize, fileType, fileHash } = req.body || {};

    if (!title || !fileHash || !fileType || typeof fileSize !== "number") {
      return res.status(400).json({
        success: false,
        message: "title, fileHash, fileType, fileSize wajib diisi",
      });
    }

    // Basic validation of hash
    if (!/^[a-f0-9]{64}$/i.test(fileHash)) {
      return res.status(400).json({ success: false, message: "Hash tidak valid" });
    }

    // Persist to DB. file_path diset kosong karena file tidak disimpan di server (demo)
    const artworkId = await Artwork.create({
      userId,
      title,
      description: description || "",
      filePath: "",
      fileSize,
      fileType,
      fileHash,
    });

    // Optional activity log (non-blocking)
    try {
      await ActivityLog.create({
        userId,
        action: "artwork_upload",
        description: `User uploaded artwork: ${title}`,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
    } catch (e) {
      // ignore
    }

    const created = await Artwork.findById(artworkId);
    res.status(201).json({ success: true, artwork: created });
  } catch (error) {
    console.error("Create artwork error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/artworks/buy - buy an artwork
router.post("/buy", async (req, res) => {
  try {
    const userId = getUserIdFromAuthHeader(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Token tidak valid" });
    }

    const { artworkId, paymentMethod } = req.body;

    if (!artworkId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "artworkId dan paymentMethod wajib diisi",
      });
    }

    // Get the original artwork
    const originalArtwork = await Artwork.findById(artworkId);
    if (!originalArtwork) {
      return res.status(404).json({ success: false, message: "Karya tidak ditemukan" });
    }

    // Check if user already owns this artwork
    const existingOwnership = await Artwork.findByUserIdAndArtworkId(userId, artworkId);
    if (existingOwnership) {
      return res.status(400).json({ 
        success: false, 
        message: "Anda sudah memiliki karya ini" 
      });
    }

    // Create a copy of the artwork for the buyer with unique hash
    const purchasedArtworkId = await Artwork.create({
      userId: userId,
      title: `${originalArtwork.title} (Dibeli)`,
      description: `Karya ini dibeli dari ${originalArtwork.user_name}. Original ID: ${originalArtwork.id}. ${originalArtwork.description || ''}`,
      filePath: originalArtwork.file_path,
      fileSize: originalArtwork.file_size,
      fileType: originalArtwork.file_type,
      fileHash: originalArtwork.file_hash,
      originalArtworkId: originalArtwork.id,
    });

    // Update status to verified since it's a purchased artwork
    await Artwork.updateStatus(purchasedArtworkId, "verified");

    // Get the created artwork with full details
    const purchasedArtwork = await Artwork.findById(purchasedArtworkId);

    res.status(201).json({ 
      success: true, 
      message: "Karya berhasil dibeli",
      artwork: purchasedArtwork 
    });
  } catch (error) {
    console.error("Buy artwork error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// DELETE /api/artworks/:id - delete an artwork
router.delete("/:id", async (req, res) => {
  try {
    const userId = getUserIdFromAuthHeader(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Token tidak valid" });
    }

    const artworkId = req.params.id;

    // Get the artwork to check ownership
    const artwork = await Artwork.findById(artworkId);
    if (!artwork) {
      return res.status(404).json({ success: false, message: "Karya tidak ditemukan" });
    }

    // Check if user owns this artwork
    if (artwork.user_id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: "Anda tidak memiliki izin untuk menghapus karya ini" 
      });
    }

    // Delete the artwork
    await Artwork.delete(artworkId);

    res.json({ 
      success: true, 
      message: "Karya berhasil dihapus"
    });
  } catch (error) {
    console.error("Delete artwork error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;


