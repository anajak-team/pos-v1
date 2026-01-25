
-- Add zone column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS zone text;

-- Optional: Create an index if you plan to search/filter by zone frequently
CREATE INDEX IF NOT EXISTS idx_products_zone ON products(zone);
