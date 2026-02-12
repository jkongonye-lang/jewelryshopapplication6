-- Create admin user using Supabase Auth
-- This will create a user with email: nelly@kkjewelry.com
-- IMPORTANT: After running this script, you need to set the password through Supabase Auth

-- Insert admin user into auth.users (this needs to be done through Supabase Auth API or Dashboard)
-- For now, we'll create a function to check if user is admin based on email

-- Create a function to check if a user is admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_email = 'nelly@kkjewelry.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: To create the admin user, you need to:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" 
-- 3. Email: nelly@kkjewelry.com
-- 4. Password: Admin123! (change after first login)
-- 5. Auto Confirm User: Yes
