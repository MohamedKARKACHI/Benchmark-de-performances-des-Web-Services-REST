INSERT INTO category (code, name, updated_at)
SELECT 
    'CAT' || LPAD(CAST(i AS TEXT), 4, '0'),
    'Category ' || i,
    NOW()
FROM generate_series(1, 10) AS i;

INSERT INTO item (sku, name, price, stock, category_id, updated_at)
SELECT 
    'SKU' || LPAD(CAST(i AS TEXT), 8, '0'),
    'Item ' || i,
    10 + (i % 100) * 0.99,
    (i % 500) + 1,
    (((i - 1) / 50) % 10) + 1,
    NOW()
FROM generate_series(1, 1000) AS i;