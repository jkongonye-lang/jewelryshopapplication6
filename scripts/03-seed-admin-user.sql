-- Insert default admin user (password: Admin123!)
-- IMPORTANT: Change this password immediately after first login!
INSERT INTO users (email, password_hash, role, full_name, phone) VALUES
    ('nelly@kkjewelry.com', '$2a$10$rZ5YhzJ8kHqZqN0xQXN0XuKd7LvP3YqE9kLr1wGzMxZJ5mN5xJ5xG', 'admin', 'Nelly KK', '+237670000000')
ON CONFLICT (email) DO NOTHING;

-- Note: This is a placeholder hash. You'll need to implement proper password hashing in the app
