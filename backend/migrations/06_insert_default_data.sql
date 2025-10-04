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
