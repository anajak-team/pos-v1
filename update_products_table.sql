-- Ensure the products table exists
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  stock numeric NOT NULL DEFAULT 0,
  category text,
  image text,
  description text,
  barcode text,
  cost numeric,
  "itemsPerCase" numeric,
  zone text,
  "isService" boolean DEFAULT false
);

-- Add columns if they don't exist (idempotent updates)
DO $$
BEGIN
    -- Add cost column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'cost') THEN
        ALTER TABLE products ADD COLUMN cost numeric;
    END IF;

    -- Add itemsPerCase column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'itemsPerCase') THEN
        ALTER TABLE products ADD COLUMN "itemsPerCase" numeric;
    END IF;

    -- Add zone column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'zone') THEN
        ALTER TABLE products ADD COLUMN zone text;
    END IF;

    -- Add isService column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'isService') THEN
        ALTER TABLE products ADD COLUMN "isService" boolean DEFAULT false;
    END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies (Adjust as needed)
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete access for authenticated users" ON products FOR DELETE USING (auth.role() = 'authenticated');
