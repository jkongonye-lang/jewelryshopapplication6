-- Création de l'utilisateur admin pour KK Jewelry
-- Exécutez ce script dans le SQL Editor de Supabase

-- Vérification d'abord si l'utilisateur existe
SELECT * FROM users WHERE email = 'admin@kkjewelry.com';

-- Création de l'utilisateur admin (si n'existe pas)
INSERT INTO users (
  id, 
  email, 
  password_hash, 
  role, 
  full_name, 
  created_at, 
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@kkjewelry.com',
  'admin123_hash',
  'admin',
  'Administrateur KK Jewelry',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Confirmation de création
SELECT * FROM users WHERE email = 'admin@kkjewelry.com';
