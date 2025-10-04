const mysql = require("mysql2/promise");
require("dotenv").config();

async function setupDatabase() {
  let connection;

  try {
    console.log("🔗 Connecting to MySQL database...");

    // Connect to MySQL server
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "pintu2.minecuta.com",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "hackaton",
      password: process.env.DB_PASSWORD || "hackaton",
    });

    console.log("✅ Connected to MySQL server");

    // Use existing database
    console.log("📊 Using database...");
    await connection.execute(`USE ${process.env.DB_NAME || "blockrights"}`);
    console.log("✅ Database selected");

    // Create users table
    console.log("👥 Creating users table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        wallet_address VARCHAR(255) NULL,
        profile_completed BOOLEAN DEFAULT FALSE,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_username (username),
        INDEX idx_email (email),
        INDEX idx_wallet_address (wallet_address)
      )
    `);
    console.log("✅ Users table created");

    // Create refresh_tokens table
    console.log("🔑 Creating refresh_tokens table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_user_id (user_id)
      )
    `);
    console.log("✅ Refresh tokens table created");

    // Insert admin user if not exists
    console.log("👤 Creating admin user...");
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("admin123", 12);

    await connection.execute(
      `
      INSERT IGNORE INTO users (name, username, email, password, profile_completed, email_verified) 
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        "Admin BlockRights",
        "admin",
        "admin@blockrights.com",
        hashedPassword,
        true,
        true,
      ]
    );

    console.log("✅ Admin user created");

    console.log("🎉 Database setup completed successfully!");
    console.log("📋 Database info:");
    console.log(`   Host: ${process.env.DB_HOST || "pintu2.minecuta.com"}`);
    console.log(`   Database: ${process.env.DB_NAME || "blockrights"}`);
    console.log(`   Admin user: admin@blockrights.com / admin123`);
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
