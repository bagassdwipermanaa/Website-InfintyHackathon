const { query } = require("../config/database");

class SystemSettings {
  // Get setting by key
  static async getByKey(key) {
    const sql = "SELECT * FROM system_settings WHERE setting_key = ?";
    const settings = await query(sql, [key]);
    return settings[0] || null;
  }

  // Get all settings
  static async getAll() {
    const sql = "SELECT * FROM system_settings ORDER BY setting_key";
    return await query(sql);
  }

  // Get public settings only
  static async getPublic() {
    const sql =
      "SELECT * FROM system_settings WHERE is_public = TRUE ORDER BY setting_key";
    return await query(sql);
  }

  // Set setting
  static async set(key, value, description = null, isPublic = false) {
    const sql = `
      INSERT INTO system_settings (setting_key, setting_value, description, is_public)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        setting_value = VALUES(setting_value),
        description = VALUES(description),
        is_public = VALUES(is_public),
        updated_at = NOW()
    `;

    const result = await query(sql, [key, value, description, isPublic]);
    return result.affectedRows > 0;
  }

  // Update setting
  static async update(key, updateData) {
    const fields = [];
    const values = [];

    Object.keys(updateData).forEach((field) => {
      if (updateData[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updateData[field]);
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(key);
    const sql = `UPDATE system_settings SET ${fields.join(
      ", "
    )}, updated_at = NOW() WHERE setting_key = ?`;

    const result = await query(sql, values);
    return result.affectedRows > 0;
  }

  // Delete setting
  static async delete(key) {
    const sql = "DELETE FROM system_settings WHERE setting_key = ?";
    const result = await query(sql, [key]);
    return result.affectedRows > 0;
  }

  // Get settings as object
  static async getAsObject() {
    const settings = await this.getAll();
    const settingsObj = {};

    settings.forEach((setting) => {
      settingsObj[setting.setting_key] = {
        value: setting.setting_value,
        description: setting.description,
        isPublic: setting.is_public,
      };
    });

    return settingsObj;
  }

  // Get public settings as object
  static async getPublicAsObject() {
    const settings = await this.getPublic();
    const settingsObj = {};

    settings.forEach((setting) => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    return settingsObj;
  }

  // Bulk update settings
  static async bulkUpdate(settingsData) {
    const promises = Object.keys(settingsData).map((key) => {
      const setting = settingsData[key];
      return this.set(
        key,
        setting.value,
        setting.description,
        setting.isPublic
      );
    });

    await Promise.all(promises);
    return true;
  }
}

module.exports = SystemSettings;
