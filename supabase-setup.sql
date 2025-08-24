-- Arunova Database Setup
-- Run this in your Supabase SQL Editor
-- Safe to run multiple times - won't create duplicates

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rent DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'unavailable')),
  location TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Admin full access" ON properties;
DROP POLICY IF EXISTS "Users can view available properties" ON properties;

-- Create RLS policies
-- Policy for admins to have full access
CREATE POLICY "Admin full access" ON properties
FOR ALL USING (true);

-- Policy for users to only see available properties
CREATE POLICY "Users can view available properties" ON properties
FOR SELECT USING (status = 'available');

-- Create updated_at trigger function (only if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON properties 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (only if table is empty)
INSERT INTO properties (title, description, rent, status, location, images) 
SELECT * FROM (VALUES
  ('Modern Downtown Apartment', 'Beautiful 2-bedroom apartment in the heart of downtown with city views.', 2500.00, 'available', 'Downtown', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800']),
  ('Cozy Suburban House', 'Charming 3-bedroom house with garden in quiet suburban neighborhood.', 3200.00, 'available', 'Suburbs', ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800']),
  ('Luxury Penthouse', 'Stunning penthouse with panoramic views and modern amenities.', 5500.00, 'unavailable', 'City Center', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'])
) AS v(title, description, rent, status, location, images)
WHERE NOT EXISTS (SELECT 1 FROM properties LIMIT 1);

-- Note: For storage setup, go to Storage in your Supabase dashboard and:
-- 1. Create a new bucket named 'property-images'
-- 2. Make it public
-- 3. Set file size limit to 50MB
-- 4. Allow image/* MIME types
