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
