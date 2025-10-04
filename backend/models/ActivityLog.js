const { query } = require("../config/database");

class ActivityLog {
  // Create activity log
  static async create(logData) {
    const {
      userId,
      adminId,
      action,
      description,
      ipAddress,
      userAgent,
      metadata,
    } = logData;

    const sql = `
      INSERT INTO activity_logs (user_id, admin_id, action, description, ip_address, user_agent, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await query(sql, [
        userId || null,
        adminId || null,
        action,
        description,
        ipAddress || null,
        userAgent || null,
        metadata ? JSON.stringify(metadata) : null,
      ]);

      return result.insertId;
    } catch (error) {
      console.error("Activity log create error:", error);
      throw error;
    }
  }

  // Get all activity logs dengan pagination
  static async findAll(limit = 50, offset = 0, userId = null, adminId = null) {
    let sql = `
      SELECT al.*, 
             u.name as user_name, u.email as user_email,
             au.full_name as admin_name, au.username as admin_username
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      LEFT JOIN admin_users au ON al.admin_id = au.id
    `;

    const params = [];
    const conditions = [];

    if (userId) {
      conditions.push("al.user_id = ?");
      params.push(userId);
    }

    if (adminId) {
      conditions.push("al.admin_id = ?");
      params.push(adminId);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY al.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    return await query(sql, params);
  }

  // Get activity log count
  static async count(userId = null, adminId = null) {
    let sql = "SELECT COUNT(*) as count FROM activity_logs";
    const params = [];
    const conditions = [];

    if (userId) {
      conditions.push("user_id = ?");
      params.push(userId);
    }

    if (adminId) {
      conditions.push("admin_id = ?");
      params.push(adminId);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    const result = await query(sql, params);
    return result[0].count;
  }

  // Get recent activity logs
  static async getRecent(limit = 10) {
    const sql = `
      SELECT al.*, 
             u.name as user_name, u.email as user_email,
             au.full_name as admin_name, au.username as admin_username
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      LEFT JOIN admin_users au ON al.admin_id = au.id
      ORDER BY al.created_at DESC
      LIMIT ?
    `;
    return await query(sql, [limit]);
  }

  // Get activity statistics
  static async getStatistics(days = 30) {
    const sql = `
      SELECT 
        COUNT(*) as total_activities,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT admin_id) as unique_admins,
        SUM(CASE WHEN action = 'login' THEN 1 ELSE 0 END) as logins,
        SUM(CASE WHEN action = 'logout' THEN 1 ELSE 0 END) as logouts,
        SUM(CASE WHEN action = 'upload' THEN 1 ELSE 0 END) as uploads,
        SUM(CASE WHEN action = 'verify' THEN 1 ELSE 0 END) as verifications
      FROM activity_logs 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `;
    const result = await query(sql, [days]);
    return result[0];
  }

  // Get activity by action
  static async getByAction(action, limit = 50, offset = 0) {
    const sql = `
      SELECT al.*, 
             u.name as user_name, u.email as user_email,
             au.full_name as admin_name, au.username as admin_username
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      LEFT JOIN admin_users au ON al.admin_id = au.id
      WHERE al.action = ?
      ORDER BY al.created_at DESC
      LIMIT ? OFFSET ?
    `;
    return await query(sql, [action, limit, offset]);
  }

  // Delete old logs (cleanup)
  static async deleteOld(days = 90) {
    const sql =
      "DELETE FROM activity_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)";
    const result = await query(sql, [days]);
    return result.affectedRows;
  }
}

module.exports = ActivityLog;
