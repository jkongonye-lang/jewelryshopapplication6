-- Seed some sample products for testing
INSERT INTO products (title, description, price_xaf, category_id, stock_quantity, images, material) VALUES
  (
    'Collier Or Rose Élégant',
    'Magnifique collier en or rose 18 carats avec pendentif en forme de cœur. Parfait pour toutes occasions.',
    45000,
    (SELECT id FROM categories WHERE slug = 'colliers' LIMIT 1),
    15,
    '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400"]',
    'Or rose 18 carats'
  ),
  (
    'Bracelet Acier Moderne Homme',
    'Bracelet robuste en acier inoxydable avec design moderne. Résistant à l''eau.',
    25000,
    (SELECT id FROM categories WHERE slug = 'bijoux-homme' LIMIT 1),
    20,
    '["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400"]',
    'Acier inoxydable'
  ),
  (
    'Boucles d''Oreilles Argent avec Pierres',
    'Élégantes boucles d''oreilles en argent sterling avec pierres semi-précieuses.',
    18000,
    (SELECT id FROM categories WHERE slug = 'boucles-oreilles' LIMIT 1),
    30,
    '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400"]',
    'Argent sterling 925'
  ),
  (
    'Bracelet Coloré Enfant',
    'Bracelet amusant et coloré pour enfants, hypoallergénique.',
    8000,
    (SELECT id FROM categories WHERE slug = 'bijoux-enfant' LIMIT 1),
    50,
    '["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400"]',
    'Silicone médical'
  ),
  (
    'Montre Cuir Premium Homme',
    'Montre de luxe avec bracelet en cuir véritable et cadran classique.',
    120000,
    (SELECT id FROM categories WHERE slug = 'montres' LIMIT 1),
    8,
    '["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400"]',
    'Cuir véritable, acier'
  ),
  (
    'Bague Or Blanc avec Diamant',
    'Magnifique bague en or blanc 18 carats avec diamant certifié.',
    250000,
    (SELECT id FROM categories WHERE slug = 'bagues' LIMIT 1),
    5,
    '["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400"]',
    'Or blanc 18 carats, diamant'
  )
ON CONFLICT DO NOTHING;
