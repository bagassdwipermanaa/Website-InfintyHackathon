const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'blockrights',
    });

    console.log('🔗 Connected to database...');

    // Add google_id column
    await connection.execute(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE
    `);
    console.log('✅ Added google_id column');

    // Add index
    try {
      await connection.execute(`
        ALTER TABLE users 
        ADD INDEX idx_google_id (google_id)
      `);
      console.log('✅ Added index for google_id');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('⚠️  Index already exists, skipping...');
      } else {
        throw error;
      }
    }

    await connection.end();
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();

