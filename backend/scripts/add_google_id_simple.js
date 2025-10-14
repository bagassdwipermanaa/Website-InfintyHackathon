const { query } = require('../config/database');

async function addGoogleIdColumn() {
  try {
    console.log('🔗 Running migration...');

    // Try to add google_id column
    try {
      await query(`
        ALTER TABLE users 
        ADD COLUMN google_id VARCHAR(255) UNIQUE
      `);
      console.log('✅ Added google_id column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  Column google_id already exists');
      } else {
        throw error;
      }
    }

    // Try to add index
    try {
      await query(`
        ALTER TABLE users 
        ADD INDEX idx_google_id (google_id)
      `);
      console.log('✅ Added index for google_id');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('⚠️  Index already exists');
      } else {
        console.log('⚠️  Index error (might be okay):', error.message);
      }
    }

    console.log('🎉 Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

addGoogleIdColumn();

