-- BlockRights Database Initialization Script
-- This script creates the database schema and initial data

-- Use existing hackaton database
USE hackaton;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    wallet_address VARCHAR(42) UNIQUE,
    avatar VARCHAR(500),
    bio TEXT,
    website VARCHAR(255),
    social_links JSON,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    two_factor_secret VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    preferences JSON DEFAULT ('{"notifications": true, "emailNotifications": true, "publicProfile": false}'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_wallet_address (wallet_address),
    INDEX idx_is_active (is_active)
);

-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64) NOT NULL UNIQUE,
    category VARCHAR(50),
    tags JSON DEFAULT ('[]'),
    license VARCHAR(50) DEFAULT 'all-rights-reserved',
    status ENUM('pending', 'verified', 'disputed', 'rejected') DEFAULT 'pending',
    metadata JSON DEFAULT ('{}'),
    watermark_data JSON,
    certificate_url VARCHAR(500),
    nft_token_id VARCHAR(50),
    blockchain_tx_hash VARCHAR(66),
    blockchain_block_number BIGINT,
    is_public BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0,
    verification_count INT DEFAULT 0,
    dispute_reason TEXT,
    dispute_resolved_at DATETIME,
    dispute_resolved_by CHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dispute_resolved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_file_hash (file_hash),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id CHAR(36) PRIMARY KEY,
    artwork_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    certificate_number VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('pdf', 'nft', 'qr') DEFAULT 'pdf',
    file_path VARCHAR(500),
    qr_code_data TEXT,
    nft_token_id VARCHAR(50),
    nft_contract_address VARCHAR(42),
    blockchain_tx_hash VARCHAR(66),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at DATETIME,
    metadata JSON DEFAULT ('{}'),
    download_count INT DEFAULT 0,
    last_downloaded_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_artwork_id (artwork_id),
    INDEX idx_user_id (user_id),
    INDEX idx_certificate_number (certificate_number),
    INDEX idx_type (type)
);

-- Create verifications table
CREATE TABLE IF NOT EXISTS verifications (
    id CHAR(36) PRIMARY KEY,
    artwork_id CHAR(36),
    verifier_ip VARCHAR(45),
    verifier_user_agent TEXT,
    verification_type ENUM('file', 'hash', 'qr') NOT NULL,
    verification_data JSON,
    is_successful BOOLEAN NOT NULL,
    result JSON,
    error_message TEXT,
    processing_time INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE SET NULL,
    INDEX idx_artwork_id (artwork_id),
    INDEX idx_verification_type (verification_type),
    INDEX idx_is_successful (is_successful),
    INDEX idx_created_at (created_at)
);

-- Create disputes table
CREATE TABLE IF NOT EXISTS disputes (
    id CHAR(36) PRIMARY KEY,
    artwork_id CHAR(36) NOT NULL,
    claimant_id CHAR(36) NOT NULL,
    status ENUM('open', 'under-review', 'resolved', 'rejected') DEFAULT 'open',
    reason TEXT NOT NULL,
    evidence JSON DEFAULT ('[]'),
    resolution TEXT,
    resolved_by CHAR(36),
    resolved_at DATETIME,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    assigned_to CHAR(36),
    notes TEXT,
    metadata JSON DEFAULT ('{}'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE,
    FOREIGN KEY (claimant_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_artwork_id (artwork_id),
    INDEX idx_claimant_id (claimant_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at)
);

-- Insert default admin user
INSERT IGNORE INTO users (id, name, email, password, is_verified, is_active) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'BlockRights Admin',
    'admin@blockrights.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', -- password: admin123
    TRUE,
    TRUE
);

-- Create indexes for better performance
CREATE INDEX idx_artworks_public ON artworks(is_public, status);
CREATE INDEX idx_artworks_creator ON artworks(user_id, created_at);
CREATE INDEX idx_verifications_successful ON verifications(is_successful, created_at);
CREATE INDEX idx_disputes_open ON disputes(status, priority);

-- Create views for common queries
CREATE OR REPLACE VIEW artwork_stats AS
SELECT 
    a.id,
    a.title,
    a.status,
    a.view_count,
    a.verification_count,
    a.download_count,
    u.name as creator_name,
    COUNT(c.id) as certificate_count,
    COUNT(v.id) as verification_count_total
FROM artworks a
LEFT JOIN users u ON a.user_id = u.id
LEFT JOIN certificates c ON a.id = c.artwork_id
LEFT JOIN verifications v ON a.id = v.artwork_id
GROUP BY a.id, a.title, a.status, a.view_count, a.verification_count, a.download_count, u.name;

-- Create stored procedure for cleanup
DELIMITER //
CREATE PROCEDURE CleanupOldData()
BEGIN
    -- Delete old failed verifications (older than 30 days)
    DELETE FROM verifications 
    WHERE is_successful = FALSE 
    AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    -- Delete old resolved disputes (older than 1 year)
    DELETE FROM disputes 
    WHERE status IN ('resolved', 'rejected') 
    AND resolved_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
    
    -- Update statistics
    UPDATE artworks a 
    SET verification_count = (
        SELECT COUNT(*) 
        FROM verifications v 
        WHERE v.artwork_id = a.id 
        AND v.is_successful = TRUE
    );
END //
DELIMITER ;

-- Create event scheduler for cleanup (runs daily)
SET GLOBAL event_scheduler = ON;
CREATE EVENT IF NOT EXISTS daily_cleanup
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO CALL CleanupOldData();

-- Insert sample data for testing
INSERT IGNORE INTO users (id, name, email, password, is_verified, is_active) VALUES
('00000000-0000-0000-0000-000000000002', 'Test User', 'test@blockrights.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', TRUE, TRUE),
('00000000-0000-0000-0000-000000000003', 'Demo Creator', 'demo@blockrights.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', TRUE, TRUE);

-- Insert sample artwork
INSERT IGNORE INTO artworks (id, user_id, title, description, file_name, file_path, file_size, file_type, file_hash, category, status, is_public) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Sample Digital Art', 'This is a sample digital artwork for testing purposes.', 'sample-art.png', '/uploads/artworks/sample-art.png', 1024000, 'image/png', 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890', 'art', 'verified', TRUE);

-- Insert sample certificate
INSERT IGNORE INTO certificates (id, artwork_id, user_id, certificate_number, type, is_active) VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'BR-20241201-00000001', 'pdf', TRUE);

COMMIT;
