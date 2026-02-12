-- Insert sample products for women
INSERT INTO products (name, description, price, category, audience, stock, images, is_active)
VALUES 
  ('Collier en Or Rose', 'Élégant collier en or rose 18 carats avec pendentif coeur', 45000, 'collier', 'femme', 15, ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop'], true),
  ('Bracelet Diamant', 'Bracelet en or blanc serti de diamants', 85000, 'bracelet', 'femme', 8, ARRAY['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop'], true),
  ('Boucles d''Oreilles Perles', 'Boucles d''oreilles avec perles naturelles', 32000, 'boucles-oreilles', 'femme', 20, ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop'], true),
  ('Bague Solitaire', 'Magnifique bague de fiançailles avec diamant solitaire', 120000, 'bague', 'femme', 5, ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop'], true),
  ('Collier Perles', 'Collier de perles véritables', 58000, 'collier', 'femme', 12, ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop'], true),
  ('Bracelet Chaine Or', 'Bracelet chaine en or jaune 18 carats', 42000, 'bracelet', 'femme', 18, ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=500&h=500&fit=crop'], true)
ON CONFLICT DO NOTHING;

-- Insert sample products for men
INSERT INTO products (name, description, price, category, audience, stock, images, is_active)
VALUES 
  ('Montre Chronographe', 'Montre de luxe avec mouvement automatique', 95000, 'montre', 'homme', 10, ARRAY['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop'], true),
  ('Bracelet Cuir', 'Bracelet en cuir véritable avec fermoir en acier', 18000, 'bracelet', 'homme', 25, ARRAY['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&h=500&fit=crop'], true),
  ('Chevalière Or', 'Chevalière classique en or jaune 18 carats', 65000, 'bague', 'homme', 12, ARRAY['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&h=500&fit=crop'], true),
  ('Montre Sport', 'Montre sportive étanche avec bracelet silicone', 38000, 'montre', 'homme', 20, ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'], true)
ON CONFLICT DO NOTHING;

-- Insert sample products for children
INSERT INTO products (name, description, price, category, audience, stock, images, is_active)
VALUES 
  ('Bracelet Enfant Rose', 'Adorable bracelet pour petite fille', 12000, 'bracelet', 'enfant', 30, ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop'], true),
  ('Collier Pendentif Étoile', 'Collier avec pendentif étoile pour enfant', 15000, 'collier', 'enfant', 20, ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop'], true),
  ('Bracelet Enfant Bleu', 'Bracelet coloré pour petit garçon', 12000, 'bracelet', 'enfant', 25, ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=500&h=500&fit=crop'], true)
ON CONFLICT DO NOTHING;
