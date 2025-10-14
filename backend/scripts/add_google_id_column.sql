-- Add google_id column to users table for Google OAuth integration
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
ADD INDEX idx_google_id (google_id);

-- Update comment for the column
ALTER TABLE users 
MODIFY COLUMN google_id VARCHAR(255) UNIQUE COMMENT 'Google OAuth user ID';

