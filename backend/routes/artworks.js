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

// Helper: extract userId from simple token format token-<id>-timestamp
function getUserIdFromAuthHeader(req) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  const token = parts.length === 2 ? parts[1] : parts[0];
  if (!token || !token.startsWith("token-")) return null;
  const segments = token.split("-");
  const idStr = segments[1];
  const userId = parseInt(idStr, 10);
  return Number.isNaN(userId) ? null : userId;
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

module.exports = router;


