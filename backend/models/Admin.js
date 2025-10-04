const { query } = require("../config/database");
const bcrypt = require("bcryptjs");

class Admin {
  // Mencari admin berdasarkan email atau username
  static async findByEmailOrUsername(emailOrUsername) {
    const sql = `
      SELECT * FROM admin_users 
      WHERE email = ? OR username = ?
    `;
    const admins = await query(sql, [emailOrUsername, emailOrUsername]);
    return admins[0] || null;
  }

  // Mencari admin berdasarkan email
  static async findByEmail(email) {
    const sql = "SELECT * FROM admin_users WHERE email = ?";
    const admins = await query(sql, [email]);
    return admins[0] || null;
  }

  // Mencari admin berdasarkan username
  static async findByUsername(username) {
    const sql = "SELECT * FROM admin_users WHERE username = ?";
    const admins = await query(sql, [username]);
    return admins[0] || null;
  }

  // Mencari admin berdasarkan ID
  static async findById(id) {
    const sql = "SELECT * FROM admin_users WHERE id = ?";
    const admins = await query(sql, [id]);
    return admins[0] || null;
  }

  // Membuat admin baru
  static async create(adminData) {
    const { username, email, password, fullName, role } = adminData;

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO admin_users (username, email, password, full_name, role)
      VALUES (?, ?, ?, ?, ?)
    `;

    try {
      const result = await query(sql, [
        username,
        email,
        hashedPassword,
        fullName,
        role || "admin",
      ]);

      return result.insertId;
    } catch (error) {
      console.error("Admin create error:", error);
      throw error;
    }
  }

  // Verifikasi password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update admin data
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
    const sql = `UPDATE admin_users SET ${fields.join(", ")} WHERE id = ?`;

    const result = await query(sql, values);
    return result.affectedRows > 0;
  }

  // Update password
  static async updatePassword(id, newPassword) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const sql = "UPDATE admin_users SET password = ? WHERE id = ?";
    const result = await query(sql, [hashedPassword, id]);
    return result.affectedRows > 0;
  }

  // Update last login
  static async updateLastLogin(id) {
    const sql = "UPDATE admin_users SET last_login = NOW() WHERE id = ?";
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  // Get all admins
  static async findAll(limit = 50, offset = 0) {
    const sql = `
      SELECT id, username, email, full_name, role, is_active, last_login, created_at
      FROM admin_users 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    return await query(sql, [limit, offset]);
  }

  // Get admin count
  static async count() {
    const sql = "SELECT COUNT(*) as count FROM admin_users";
    const result = await query(sql);
    return result[0].count;
  }

  // Delete admin
  static async delete(id) {
    const sql = "DELETE FROM admin_users WHERE id = ?";
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  // Get admin tanpa password untuk response
  static sanitizeAdmin(admin) {
    if (!admin) return null;

    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }

  // Cek apakah email sudah terdaftar
  static async isEmailExists(email) {
    const admin = await this.findByEmail(email);
    return !!admin;
  }

  // Cek apakah username sudah terdaftar
  static async isUsernameExists(username) {
    const admin = await this.findByUsername(username);
    return !!admin;
  }
}

module.exports = Admin;
