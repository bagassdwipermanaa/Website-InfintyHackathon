const { query } = require("../config/database");
const bcrypt = require("bcryptjs");

class User {
  // Mencari user berdasarkan email atau username
  static async findByEmailOrUsername(emailOrUsername) {
    const sql = `
      SELECT * FROM users 
      WHERE email = ? OR username = ?
    `;
    const users = await query(sql, [emailOrUsername, emailOrUsername]);
    return users[0] || null;
  }

  // Mencari user berdasarkan email
  static async findByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    const users = await query(sql, [email]);
    return users[0] || null;
  }

  // Mencari user berdasarkan username
  static async findByUsername(username) {
    const sql = "SELECT * FROM users WHERE username = ?";
    const users = await query(sql, [username]);
    return users[0] || null;
  }

  // Mencari user berdasarkan ID
  static async findById(id) {
    const sql = "SELECT * FROM users WHERE id = ?";
    const users = await query(sql, [id]);
    return users[0] || null;
  }

  // Membuat user baru
  static async create(userData) {
    const { name, username, email, password, walletAddress } = userData;

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (name, username, email, password, wallet_address)
      VALUES (?, ?, ?, ?, ?)
    `;

    try {
      const result = await query(sql, [
        name,
        username,
        email,
        hashedPassword,
        walletAddress || null,
      ]);

      return result.insertId;
    } catch (error) {
      console.error("User create error:", error);
      throw error;
    }
  }

  // Verifikasi password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user data
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
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    const result = await query(sql, values);
    return result.affectedRows > 0;
  }

  // Update password
  static async updatePassword(id, newPassword) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const sql = "UPDATE users SET password = ? WHERE id = ?";
    const result = await query(sql, [hashedPassword, id]);
    return result.affectedRows > 0;
  }

  // Delete user
  static async delete(id) {
    const sql = "DELETE FROM users WHERE id = ?";
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  // Get user tanpa password untuk response
  static sanitizeUser(user) {
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Cek apakah email sudah terdaftar
  static async isEmailExists(email) {
    const user = await this.findByEmail(email);
    return !!user;
  }

  // Cek apakah username sudah terdaftar
  static async isUsernameExists(username) {
    const user = await this.findByUsername(username);
    return !!user;
  }
}

module.exports = User;
