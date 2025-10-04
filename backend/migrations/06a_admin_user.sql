-- Insert default admin user
INSERT INTO admin_users (username, email, password, full_name, role) 
VALUES ('admin', 'admin@blockrights.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8Q8Q8Q', 'System Administrator', 'super_admin')
ON DUPLICATE KEY UPDATE username = username;
