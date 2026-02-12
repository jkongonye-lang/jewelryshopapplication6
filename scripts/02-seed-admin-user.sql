-- Insert admin user (password: admin123)
-- Note: In production, this password should be hashed with bcrypt
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('nelly@kkjewelry.com', 'admin123', 'Nelly Admin', 'admin')
ON CONFLICT (email) DO NOTHING;
