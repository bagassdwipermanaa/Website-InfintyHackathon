-- Database schema untuk BlockRights
-- Host: pintu2.minecuta.com:3306
-- Username: hackaton
-- Password: hackaton

CREATE DATABASE IF NOT EXISTS blockrights;
USE blockrights;

-- Tabel users untuk menyimpan data pengguna
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
    
    -- Index untuk performa pencarian
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_wallet_address (wallet_address)
);

-- Tabel untuk menyimpan refresh tokens (opsional untuk remember me)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
);

-- Insert data admin contoh (opsional)
INSERT INTO users (name, username, email, password, profile_completed, email_verified) 
VALUES ('Admin BlockRights', 'admin', 'admin@blockrights.com', '$2b$10$rQZ8K9vL3mN2pQ7sT1uW5e', TRUE, TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);
