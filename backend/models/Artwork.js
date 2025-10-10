const { query } = require("../config/database");

class Artwork {
  // Mencari artwork berdasarkan ID
  static async findById(id) {
    const sql = `
      SELECT a.*, u.name as user_name, u.email as user_email,
             au.full_name as verified_by_name
      FROM artworks a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN admin_users au ON a.verified_by = au.id
      WHERE a.id = ?
    `;
    const artworks = await query(sql, [id]);
    return artworks[0] || null;
  }

  // Mencari artwork berdasarkan user ID
  static async findByUserId(userId, limit = 50, offset = 0) {
    const sql = `
      SELECT a.*, u.name as user_name, u.email as user_email,
             au.full_name as verified_by_name
      FROM artworks a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN admin_users au ON a.verified_by = au.id
      WHERE a.user_id = ?
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return await query(sql, [userId, limit, offset]);
  }

  // Mencari artwork berdasarkan hash
  static async findByHash(fileHash) {
    const sql = `
      SELECT a.*, u.name as user_name, u.email as user_email,
             au.full_name as verified_by_name
      FROM artworks a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN admin_users au ON a.verified_by = au.id
      WHERE LOWER(a.file_hash) = LOWER(?)
      LIMIT 1
    `;
    const artworks = await query(sql, [fileHash]);
    return artworks[0] || null;
  }

  // Get all artworks dengan pagination
  static async findAll(limit = 50, offset = 0, status = null) {
    let sql = `
      SELECT a.*, u.name as user_name, u.email as user_email,
             au.full_name as verified_by_name
      FROM artworks a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN admin_users au ON a.verified_by = au.id
    `;

    const params = [];

    if (status) {
      sql += " WHERE a.status = ?";
      params.push(status);
    }

    sql += " ORDER BY a.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    return await query(sql, params);
  }

  // Get artwork count
  static async count(status = null) {
    let sql = "SELECT COUNT(*) as count FROM artworks";
    const params = [];

    if (status) {
      sql += " WHERE status = ?";
      params.push(status);
    }

    const result = await query(sql, params);
    return result[0].count;
  }

  // Get statistics
  static async getStatistics() {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'disputed' THEN 1 ELSE 0 END) as disputed
      FROM artworks
    `;
    const result = await query(sql);
    return result[0];
  }

  // Create artwork
  static async create(artworkData) {
    const {
      userId,
      title,
      description,
      filePath,
      fileSize,
      fileType,
      fileHash,
      originalArtworkId,
    } = artworkData;

    const sql = `
      INSERT INTO artworks (user_id, title, description, file_path, file_size, file_type, file_hash, original_artwork_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await query(sql, [
        userId,
        title,
        description,
        filePath,
        fileSize,
        fileType,
        fileHash,
        originalArtworkId || null,
      ]);

      return result.insertId;
    } catch (error) {
      console.error("Artwork create error:", error);
      throw error;
    }
  }

  // Update artwork
  static async update(id, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const sql = `UPDATE artworks SET ${fields.join(", ")} WHERE id = ?`;

    const result = await query(sql, values);
    return result.affectedRows > 0;
  }

  // Update status
  static async updateStatus(id, status, verifiedBy = null) {
    const sql = `
      UPDATE artworks 
      SET status = ?, verified_by = ?, verification_date = NOW()
      WHERE id = ?
    `;
    const result = await query(sql, [status, verifiedBy, id]);
    return result.affectedRows > 0;
  }

  // Delete artwork
  static async delete(id) {
    const sql = "DELETE FROM artworks WHERE id = ?";
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  // Get recent artworks
  static async getRecent(limit = 10) {
    const sql = `
      SELECT a.*, u.name as user_name, u.email as user_email
      FROM artworks a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT ?
    `;
    return await query(sql, [limit]);
  }

  // Check if user owns a specific artwork (by original artwork ID)
  static async findByUserIdAndArtworkId(userId, originalArtworkId) {
    const sql = `
      SELECT a.*, u.name as user_name, u.email as user_email
      FROM artworks a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.user_id = ? AND a.description LIKE ?
      LIMIT 1
    `;
    const artworks = await query(sql, [userId, `%Original ID: ${originalArtworkId}%`]);
    return artworks[0] || null;
  }

  // Get public verified artworks (excluding purchased ones)
  static async findPublicVerified(limit = 50, offset = 0) {
    const sql = `
      SELECT a.*, u.name as user_name, u.email as user_email,
             au.full_name as verified_by_name
      FROM artworks a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN admin_users au ON a.verified_by = au.id
      WHERE a.status = 'verified' AND a.title NOT LIKE '%(Dibeli)'
      ORDER BY a.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return await query(sql, [limit, offset]);
  }

  // Count public verified artworks (excluding purchased ones)
  static async countPublicVerified() {
    const sql = `
      SELECT COUNT(*) as count 
      FROM artworks 
      WHERE status = 'verified' AND title NOT LIKE '%(Dibeli)'
    `;
    const result = await query(sql);
    return result[0].count;
  }
}

module.exports = Artwork;
