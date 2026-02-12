-- ============================================
-- KK JEWELRY - SCRIPT DE CRÉATION DES TABLES
-- ============================================

-- Table des catégories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  target_audience TEXT NOT NULL CHECK (target_audience IN ('homme', 'femme', 'enfant', 'mixte')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les catégories
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_target_audience ON categories(target_audience);

-- Table des produits
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price_xaf INTEGER NOT NULL CHECK (price_xaf > 0),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  material TEXT,
  weight_grams DECIMAL(8,2),
  dimensions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les produits
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Table des utilisateurs
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  phone TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les utilisateurs
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Table des commandes
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT,
  total_xaf INTEGER NOT NULL CHECK (total_xaf > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'processing', 'completed')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Index pour les commandes
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Table des éléments de commande
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_xaf INTEGER NOT NULL CHECK (unit_price_xaf > 0),
  subtotal_xaf INTEGER NOT NULL CHECK (subtotal_xaf > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les éléments de commande
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Table des paiements
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('orange_money', 'mtn_money', 'cash')),
  transaction_id TEXT,
  amount_xaf INTEGER NOT NULL CHECK (amount_xaf > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled')),
  provider_response JSONB,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Index pour les paiements
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- FONCTIONS ET TRIGGERS
-- ============================================

-- Fonction pour générer automatiquement les numéros de commande
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_num TEXT;
BEGIN
  year_part := EXTRACT(year FROM NOW())::TEXT;
  
  -- Créer une séquence si elle n'existe pas
  BEGIN
    CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;
  EXCEPTION WHEN duplicate_table THEN
    -- La séquence existe déjà
  END;
  
  sequence_num := LPAD(nextval('order_number_seq')::TEXT, 3, '0');
  RETURN 'CMD-' || year_part || '-' || sequence_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement le numéro de commande
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_order_number();

-- Fonction pour décrémenter le stock
CREATE OR REPLACE FUNCTION decrement_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products 
  SET stock_quantity = stock_quantity - NEW.quantity,
      updated_at = NOW()
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour décrémenter le stock après confirmation de paiement
CREATE TRIGGER decrement_stock_after_payment
AFTER UPDATE ON payments
FOR EACH ROW
WHEN (NEW.status = 'success' AND OLD.status != 'success')
EXECUTE FUNCTION decrement_product_stock();

-- ============================================
-- ACTIVATION DE RLS (ROW LEVEL SECURITY)
-- ============================================

-- Activer RLS sur les tables sensibles
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politiques pour les produits (lecture publique pour les produits actifs)
CREATE POLICY "Les produits actifs sont visibles par tout le monde" ON products
FOR SELECT USING (is_active = true);

-- Politiques pour les commandes (seul l'admin peut voir/modifier)
CREATE POLICY "Seul l'admin peut gérer les commandes" ON orders
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Politiques pour order_items
CREATE POLICY "Seul l'admin peut gérer les éléments de commande" ON order_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Politiques pour payments
CREATE POLICY "Seul l'admin peut gérer les paiements" ON payments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- ============================================
-- DONNÉES INITIALES
-- ============================================

-- Insertion des catégories par défaut
INSERT INTO categories (name, slug, target_audience, description) VALUES
('Colliers', 'colliers', 'femme', 'Magnifiques colliers pour femmes'),
('Bracelets', 'bracelets', 'homme', 'Bracelets élégants pour hommes'),
('Boucles d''oreilles', 'boucles-oreilles', 'femme', 'Élégantes boucles d''oreilles'),
('Bracelets enfants', 'bracelets-enfants', 'enfant', 'Bracelets colorés et sécurisés pour enfants'),
('Montres', 'montres', 'homme', 'Montres modernes et élégantes'),
('Bagues', 'bagues', 'femme', 'Bagues magnifiques pour toutes occasions');

-- Insertion de l'utilisateur admin par défaut
INSERT INTO users (email, password_hash, role, full_name) VALUES
('admin@kkjewelry.com', '$2b$12$LQv3c1yqBWVHxkd0LdTOu7rTOcYq6vL7JzQGtQJz8QKzHd5x9y', 'admin', 'Administrateur KK Jewelry');

-- Insertion des produits de démonstration
INSERT INTO products (title, description, price_xaf, category_id, stock_quantity, images, is_active, material, weight_grams, dimensions) 
SELECT 
  'Collier Or Rose Élégant',
  'Un magnifique collier en or rose avec pendentif en forme de cœur. Parfait pour toutes les occasions spéciales.',
  45000,
  id,
  15,
  ARRAY['/elegant-rose-gold-necklace.jpg'],
  true,
  'Or rose 18 carats',
  5.2,
  'Longueur: 45cm, Pendentif: 3cm'
FROM categories WHERE slug = 'colliers' LIMIT 1;

INSERT INTO products (title, description, price_xaf, category_id, stock_quantity, images, is_active, material, weight_grams, dimensions) 
SELECT 
  'Bracelet Homme Acier Inoxydable',
  'Bracelet moderne en acier inoxydable, résistant et élégant. Design masculin contemporain.',
  28000,
  id,
  20,
  ARRAY['/modern-steel-mens-bracelet.jpg'],
  true,
  'Acier inoxydable',
  8.5,
  'Longueur: 22cm, Largeur: 1.5cm'
FROM categories WHERE slug = 'bracelets' AND target_audience = 'homme' LIMIT 1;

INSERT INTO products (title, description, price_xaf, category_id, stock_quantity, images, is_active, material, weight_grams, dimensions) 
SELECT 
  'Boucles d''Oreilles Argent',
  'Élégantes boucles d''oreilles en argent sterling avec pierres scintillantes. Parfaites pour un look raffiné.',
  35000,
  id,
  12,
  ARRAY['/silver-earrings-with-stones.jpg'],
  true,
  'Argent sterling 925',
  3.8,
  'Hauteur: 2.5cm, Largeur: 1.8cm'
FROM categories WHERE slug = 'boucles-oreilles' LIMIT 1;

INSERT INTO products (title, description, price_xaf, category_id, stock_quantity, images, is_active, material, weight_grams, dimensions) 
SELECT 
  'Bracelet Enfant Coloré',
  'Joli bracelet multicolore pour enfant avec perles sécurisées. Hypoallergénique et ajustable.',
  12000,
  id,
  25,
  ARRAY['/colorful-kids-bracelet.jpg'],
  true,
  'Perles en plastique sécurisé',
  2.1,
  'Longueur: 16cm (ajustable)'
FROM categories WHERE slug = 'bracelets-enfants' LIMIT 1;

INSERT INTO products (title, description, price_xaf, category_id, stock_quantity, images, is_active, material, weight_grams, dimensions) 
SELECT 
  'Montre Homme Cuir Premium',
  'Montre élégante avec bracelet en cuir véritable et cadran noir. Mécanisme de précision.',
  65000,
  id,
  8,
  ARRAY['/premium-leather-mens-watch.jpg'],
  true,
  'Cuir véritable + Acier',
  45.0,
  'Diamètre: 42mm, Épaisseur: 10mm'
FROM categories WHERE slug = 'montres' LIMIT 1;

INSERT INTO products (title, description, price_xaf, category_id, stock_quantity, images, is_active, material, weight_grams, dimensions) 
SELECT 
  'Bague Or Blanc Diamant',
  'Magnifique bague en or blanc sertie d''un diamant. Pièce d''exception pour les grandes occasions.',
  95000,
  id,
  5,
  ARRAY['/white-gold-diamond-ring.jpg'],
  true,
  'Or blanc 18 carats + Diamant',
  2.8,
  'Taille: 52, Diamant: 0.5 carat'
FROM categories WHERE slug = 'bagues' LIMIT 1;

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérification des tables créées
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Vérification des données insérées
SELECT 'categories' as table_name, COUNT(*) as record_count FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'users', COUNT(*) FROM users;
