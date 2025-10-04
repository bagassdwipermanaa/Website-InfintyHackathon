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
    const user = users[0] || null;

    if (user && user.social_links) {
      try {
        user.socialLinks = JSON.parse(user.social_links);
      } catch (error) {
        user.socialLinks = {};
      }
    }

    return user;
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

  // Update user profile
  static async updateProfile(id, profileData) {
    const { name, email, bio, website, walletAddress, socialLinks } =
      profileData;

    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }

    if (email !== undefined) {
      fields.push("email = ?");
      values.push(email);
    }

    if (bio !== undefined) {
      fields.push("bio = ?");
      values.push(bio);
    }

    if (website !== undefined) {
      fields.push("website = ?");
      values.push(website);
    }

    if (walletAddress !== undefined) {
      fields.push("wallet_address = ?");
      values.push(walletAddress);
    }

    if (socialLinks !== undefined) {
      fields.push("social_links = ?");
      values.push(JSON.stringify(socialLinks));
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    const result = await query(sql, values);

    if (result.affectedRows > 0) {
      // Return updated user
      return await this.findById(id);
    }

    return null;
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

    const { password, social_links, ...userWithoutPassword } = user;

    // Parse social_links if it exists
    if (user.social_links) {
      try {
        userWithoutPassword.socialLinks = JSON.parse(user.social_links);
      } catch (error) {
        userWithoutPassword.socialLinks = {};
      }
    }

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

  // Get user count
  static async count() {
    const sql = "SELECT COUNT(*) as count FROM users";
    const result = await query(sql);
    return result[0].count;
  }

  // Get active user count
  static async countActive() {
    const sql = "SELECT COUNT(*) as count FROM users WHERE is_active = TRUE";
    const result = await query(sql);
    return result[0].count;
  }

  // Generic query method
  static async query(sql, params = []) {
    const { query: dbQuery } = require("../config/database");
    return await dbQuery(sql, params);
  }

  // Calculate profile completeness
  static calculateProfileCompleteness(user) {
    const requiredFields = ["name", "email"];
    const optionalFields = ["bio", "website", "walletAddress", "socialLinks"];

    const completedFields = [];
    const missingFields = [];

    // Check required fields
    requiredFields.forEach((field) => {
      if (user[field] && user[field].toString().trim() !== "") {
        completedFields.push(field);
      } else {
        missingFields.push(field);
      }
    });

    // Check optional fields
    optionalFields.forEach((field) => {
      if (field === "socialLinks") {
        if (user.socialLinks && Object.keys(user.socialLinks).length > 0) {
          const hasSocialLinks = Object.values(user.socialLinks).some(
            (link) => link && link.toString().trim() !== ""
          );
          if (hasSocialLinks) {
            completedFields.push(field);
          } else {
            missingFields.push(field);
          }
        } else {
          missingFields.push(field);
        }
      } else {
        if (user[field] && user[field].toString().trim() !== "") {
          completedFields.push(field);
        } else {
          missingFields.push(field);
        }
      }
    });

    const totalFields = requiredFields.length + optionalFields.length;
    const percentage = Math.round((completedFields.length / totalFields) * 100);

    return {
      percentage,
      completedFields,
      missingFields,
      totalFields,
    };
  }
}

module.exports = User;
