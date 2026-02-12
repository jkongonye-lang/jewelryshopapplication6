# Configuration de la base de données Supabase

Ce guide vous aidera à configurer la base de données Supabase pour votre application KK Jewelry.

## 1. Création du projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Choisissez une organisation ou créez-en une
5. Nommez votre projet (ex: `kk-jewelry-shop`)
6. Choisissez une base de données et un mot de passe fort
7. Sélectionnez la région la plus proche de vos clients
8. Cliquez sur "Create new project"

## 2. Configuration des variables d'environnement

Une fois le projet créé, copiez les clés depuis les paramètres du projet :

1. Allez dans `Settings` > `API`
2. Copiez les valeurs suivantes dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-ici
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role-ici
```

## 3. Création des tables

Exécutez ces requêtes SQL dans l'éditeur SQL de Supabase (`Table Editor` > `New table` > `SQL Editor`) :

### Table des catégories
```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  target_audience TEXT NOT NULL CHECK (target_audience IN ('homme', 'femme', 'enfant', 'mixte')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création d'index
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_target_audience ON categories(target_audience);
```

### Table des produits
```sql
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

-- Création d'index
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
```

### Table des utilisateurs
```sql
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

-- Création d'index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Table des commandes
```sql
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

-- Création d'index
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

### Table des éléments de commande
```sql
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

-- Création d'index
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

### Table des paiements
```sql
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

-- Création d'index
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(status);
```

## 4. Fonctions et triggers

### Fonction pour décrémenter le stock
```sql
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
```

### Fonction pour générer automatiquement les numéros de commande
```sql
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
```

### Trigger pour générer automatiquement le numéro de commande
```sql
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
```

## 5. Insertion des données initiales

### Catégories par défaut
```sql
INSERT INTO categories (name, slug, target_audience, description) VALUES
('Colliers', 'colliers', 'femme', 'Magnifiques colliers pour femmes'),
('Bracelets', 'bracelets', 'homme', 'Bracelets élégants pour hommes'),
('Boucles d''oreilles', 'boucles-oreilles', 'femme', 'Élégantes boucles d''oreilles'),
('Bracelets enfants', 'bracelets-enfants', 'enfant', 'Bracelets colorés et sécurisés pour enfants'),
('Montres', 'montres', 'homme', 'Montres modernes et élégantes'),
('Bagues', 'bagues', 'femme', 'Bagues magnifiques pour toutes occasions');
```

### Utilisateur admin par défaut
```sql
INSERT INTO users (email, password_hash, role, full_name) VALUES
('admin@kkjewelry.com', '$2b$10$placeholder_hash_here', 'admin', 'Administrateur KK Jewelry');
```

## 6. Configuration RLS (Row Level Security)

Activez RLS sur les tables sensibles :

```sql
-- Activer RLS
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

-- Politiques similaires pour order_items et payments
CREATE POLICY "Seul l'admin peut gérer les éléments de commande" ON order_items
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Seul l'admin peut gérer les paiements" ON payments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);
```

## 7. Test de la configuration

1. Redémarrez votre application Next.js
2. Vérifiez que vous pouvez accéder à l'admin
3. Essayez de créer un produit via l'interface admin
4. Vérifiez que les produits apparaissent sur le site public

## 8. Prochaines étapes

- Configurez l'intégration paiement avec NotchPay ou Orange Money API
- Mettez en place l'upload d'images avec Supabase Storage
- Configurez les emails de notification avec Resend ou un autre service
- Déployez votre application sur Vercel ou une autre plateforme

## Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs de Supabase dans `Settings` > `Logs`
2. Vérifiez que vos variables d'environnement sont correctement configurées
3. Assurez-vous que les politiques RLS sont correctement configurées
