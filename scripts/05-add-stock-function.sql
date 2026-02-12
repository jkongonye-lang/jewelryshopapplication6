-- Function to safely decrement product stock
CREATE OR REPLACE FUNCTION decrement_product_stock(
    product_id UUID,
    quantity_to_subtract INTEGER
)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET stock_quantity = GREATEST(0, stock_quantity - quantity_to_subtract)
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;
