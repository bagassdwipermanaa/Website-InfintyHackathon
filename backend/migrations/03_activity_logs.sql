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
