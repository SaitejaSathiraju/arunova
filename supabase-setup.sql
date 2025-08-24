-- Arunova Property Management Tool - Database Setup
-- Run this script in your Supabase SQL Editor

-- Create the properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rent DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('available', 'unavailable')) NOT NULL DEFAULT 'available',
  location TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- Create an index on location for faster searching
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);

-- Create an index on rent for faster filtering
CREATE INDEX IF NOT EXISTS idx_properties_rent ON properties(rent);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all authenticated users to read available properties
CREATE POLICY "Allow read access to available properties" ON properties
  FOR SELECT USING (status = 'available');

-- Create a policy that allows admins to read all properties
CREATE POLICY "Allow admins to read all properties" ON properties
  FOR SELECT USING (true);

-- Create a policy that allows admins to insert properties
CREATE POLICY "Allow admins to insert properties" ON properties
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows admins to update properties
CREATE POLICY "Allow admins to update properties" ON properties
  FOR UPDATE USING (true);

-- Create a policy that allows admins to delete properties
CREATE POLICY "Allow admins to delete properties" ON properties
  FOR DELETE USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample properties for testing
INSERT INTO properties (title, description, rent, status, location, images) VALUES
(
  'Modern Downtown Apartment',
  'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views, modern amenities, and convenient access to shopping and restaurants.',
  2500.00,
  'available',
  'Downtown City Center',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800']
),
(
  'Cozy Suburban House',
  'Charming 3-bedroom house in a quiet suburban neighborhood with a large backyard, garage, and excellent school district.',
  3200.00,
  'available',
  'Suburban Heights',
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800']
),
(
  'Luxury Penthouse Suite',
  'Exclusive penthouse with panoramic views, high-end finishes, private balcony, and access to building amenities including pool and gym.',
  5500.00,
  'unavailable',
  'Luxury Tower District',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800']
),
(
  'Student-Friendly Studio',
  'Affordable studio apartment perfect for students, close to university campus with basic amenities and utilities included.',
  1200.00,
  'available',
  'University District',
  ARRAY['https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800']
);

-- Grant necessary permissions
GRANT ALL ON properties TO authenticated;
GRANT ALL ON properties TO anon;

-- Enable realtime for the properties table (optional, for real-time updates)
ALTER PUBLICATION supabase_realtime ADD TABLE properties;
