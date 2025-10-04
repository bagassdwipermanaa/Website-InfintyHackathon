-- Add role and status columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL;
