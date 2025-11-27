-- Fix storage policies for avatars bucket
-- Run this in Supabase SQL Editor

-- First, drop all existing policies on storage.objects for avatars
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow avatar uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow avatar updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow avatar deletes" ON storage.objects;

-- Create simple, permissive policies for avatars bucket
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload to avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can update avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can delete from avatars"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars');

-- Same for cover-images bucket
DROP POLICY IF EXISTS "Public can view cover images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload cover images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update cover images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete cover images" ON storage.objects;
DROP POLICY IF EXISTS "Allow cover uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow cover updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow cover deletes" ON storage.objects;

CREATE POLICY "Anyone can view cover images"
ON storage.objects FOR SELECT
USING (bucket_id = 'cover-images');

CREATE POLICY "Anyone can upload to cover images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cover-images');

CREATE POLICY "Anyone can update cover images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'cover-images');

CREATE POLICY "Anyone can delete from cover images"
ON storage.objects FOR DELETE
USING (bucket_id = 'cover-images');
