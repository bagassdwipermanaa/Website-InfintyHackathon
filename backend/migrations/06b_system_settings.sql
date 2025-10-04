-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('site_name', 'BlockRights', 'Nama situs', TRUE),
('site_description', 'Digital Copyright Verifier', 'Deskripsi situs', TRUE),
('max_file_size', '10485760', 'Maksimal ukuran file (bytes)', FALSE),
('allowed_file_types', 'jpg,jpeg,png,gif,pdf,doc,docx', 'Tipe file yang diizinkan', FALSE),
('maintenance_mode', 'false', 'Mode maintenance', FALSE),
('registration_enabled', 'true', 'Registrasi user baru diizinkan', FALSE);
