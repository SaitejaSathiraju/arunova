-- Create storage bucket for property images
-- This will be created through the Supabase dashboard instead of SQL
-- Go to Storage > Create a new bucket named 'property-images' and make it public

-- Note: The storage bucket 'property-images' should be created manually in the Supabase dashboard
-- with the following settings:
-- - Name: property-images
-- - Public bucket: true
-- - File size limit: 50MB (or your preferred limit)
-- - Allowed MIME types: image/*

-- The bucket will automatically have the correct permissions for public read access
-- and authenticated users can upload files by default
