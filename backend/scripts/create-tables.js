const mysql = require("mysql2/promise");
require("dotenv").config();

async function createTables() {
  let connection;

  try {
    console.log("🔗 Connecting to database...");

    // Try different databases
    const databases = ["haleyora", "vicky", "panel", "starscity"];

    for (const dbName of databases) {
      try {
        console.log(`\n📊 Trying database: ${dbName}`);

        connection = await mysql.createConnection({
          host: process.env.DB_HOST || "pintu2.minecuta.com",
          port: process.env.DB_PORT || 3306,
          user: process.env.DB_USER || "hackaton",
          password: process.env.DB_PASSWORD || "hackaton",
          database: dbName,
        });

        console.log(`✅ Connected to ${dbName} database`);

        // Create users table
        console.log("👥 Creating users table...");
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS blockrights_users (
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

        // Insert test user
        console.log("👤 Creating test user...");
        const bcrypt = require("bcryptjs");
        const hashedPassword = await bcrypt.hash("admin123", 12);

        await connection.execute(
          `
          INSERT IGNORE INTO blockrights_users (name, username, email, password, profile_completed, email_verified) 
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

        console.log("✅ Test user created");

        // Check users
        const [users] = await connection.execute(
          "SELECT COUNT(*) as count FROM blockrights_users"
        );
        console.log(`👥 Total users: ${users[0].count}`);

        console.log(`🎉 Successfully setup tables in ${dbName} database!`);
        console.log(`📋 Database: ${dbName}`);
        console.log(`📋 Table: blockrights_users`);
        console.log(`👤 Test user: admin@blockrights.com / admin123`);

        break; // Exit loop if successful
      } catch (error) {
        console.log(`❌ Failed to connect to ${dbName}: ${error.message}`);
        if (connection) {
          await connection.end();
          connection = null;
        }
      }
    }
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createTables();
