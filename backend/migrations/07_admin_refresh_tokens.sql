-- Create admin refresh tokens table
CREATE TABLE IF NOT EXISTS admin_refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
);
