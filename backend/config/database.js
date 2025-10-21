const mysql = require("mysql2/promise");
require("dotenv").config();

// Konfigurasi koneksi database MySQL
const dbConfig = {
  host: process.env.DB_HOST || "pintu2.minecuta.com",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "hackaton",
  password: process.env.DB_PASSWORD || "bagas4777",
  database: process.env.DB_NAME || "blockrights",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
};

// Membuat connection pool
const pool = mysql.createPool(dbConfig);

// Test koneksi database
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    console.log(
      `📊 Connected to: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
    );
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Helper function untuk query database
const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

// Helper function untuk transaction
const transaction = async (callback) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  query,
  transaction,
  testConnection,
};
