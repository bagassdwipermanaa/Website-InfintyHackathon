-- Admin System Database Migration
-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(255) NOT NULL,
    blockchain_hash VARCHAR(255) NULL,
    status ENUM('pending', 'verified', 'rejected', 'disputed') DEFAULT 'pending',
    verification_date TIMESTAMP NULL,
    verified_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Create activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    admin_id INT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Create system settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add role column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL;

-- Insert default admin user
INSERT INTO admin_users (username, email, password, full_name, role) 
VALUES ('admin', 'admin@blockrights.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8Q8Q8Q', 'System Administrator', 'super_admin')
ON DUPLICATE KEY UPDATE username = username;

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('site_name', 'BlockRights', 'Nama situs', TRUE),
('site_description', 'Digital Copyright Verifier', 'Deskripsi situs', TRUE),
('max_file_size', '10485760', 'Maksimal ukuran file (bytes)', FALSE),
('allowed_file_types', 'jpg,jpeg,png,gif,pdf,doc,docx', 'Tipe file yang diizinkan', FALSE),
('maintenance_mode', 'false', 'Mode maintenance', FALSE),
('registration_enabled', 'true', 'Registrasi user baru diizinkan', FALSE)
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
