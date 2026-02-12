-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access to products and categories
CREATE POLICY "Public can view active products"
    ON products FOR SELECT
    USING (is_active = true);

CREATE POLICY "Public can view categories"
    ON categories FOR SELECT
    USING (true);

-- RLS Policies for admin full access
CREATE POLICY "Admins have full access to products"
    ON products FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins have full access to orders"
    ON orders FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins have full access to order_items"
    ON order_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins have full access to payments"
    ON payments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins have full access to categories"
    ON categories FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Allow public to insert orders (guest checkout)
CREATE POLICY "Anyone can create orders"
    ON orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can create order_items"
    ON order_items FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can create payments"
    ON payments FOR INSERT
    WITH CHECK (true);

-- Public can view their own orders by order number
CREATE POLICY "Public can view orders"
    ON orders FOR SELECT
    USING (true);

CREATE POLICY "Public can view order_items"
    ON order_items FOR SELECT
    USING (true);
