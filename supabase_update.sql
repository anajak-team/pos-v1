-- Create the defective_items table
CREATE TABLE IF NOT EXISTS defective_items (
  id text PRIMARY KEY,
  "productId" text NOT NULL,
  "productName" text NOT NULL,
  quantity numeric NOT NULL,
  reason text NOT NULL,
  date timestamp with time zone NOT NULL,
  "reportedBy" text
);

-- Enable Row Level Security (RLS)
ALTER TABLE defective_items ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your security model)
-- Allow all authenticated users to view defective items
CREATE POLICY "Enable read access for authenticated users" ON defective_items
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow all authenticated users to insert defective items
CREATE POLICY "Enable insert access for authenticated users" ON defective_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow all authenticated users to update defective items
CREATE POLICY "Enable update access for authenticated users" ON defective_items
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow all authenticated users to delete defective items
CREATE POLICY "Enable delete access for authenticated users" ON defective_items
  FOR DELETE USING (auth.role() = 'authenticated');
