-- Insert default categories
INSERT INTO categories (name, slug, target_audience, description) VALUES
    ('Colliers', 'colliers-femme', 'femme', 'Colliers élégants pour femmes'),
    ('Bracelets Femme', 'bracelets-femme', 'femme', 'Bracelets raffinés pour femmes'),
    ('Boucles d''Oreilles', 'boucles-oreilles', 'femme', 'Boucles d''oreilles modernes et classiques'),
    ('Bagues', 'bagues', 'mixte', 'Bagues pour toutes les occasions'),
    ('Montres Homme', 'montres-homme', 'homme', 'Montres élégantes pour hommes'),
    ('Bracelets Homme', 'bracelets-homme', 'homme', 'Bracelets masculins'),
    ('Bijoux Enfant', 'bijoux-enfant', 'enfant', 'Bijoux adorables pour enfants'),
    ('Parures', 'parures', 'femme', 'Ensembles coordonnés de bijoux')
ON CONFLICT (slug) DO NOTHING;
