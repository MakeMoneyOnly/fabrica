-- Fabrica Storage Buckets Migration
-- This migration creates all required storage buckets with appropriate security policies
-- for the Fabrica creator commerce platform.

BEGIN;

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Product files bucket: Private bucket for digital product files
-- Max file size: 500MB (enforced at application level)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-files',
  'product-files',
  false, -- Private bucket - requires signed URLs
  524288000, -- 500MB in bytes
  ARRAY[
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'image/jpeg',
    'image/png',
    'image/gif'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Cover images bucket: Public bucket for product cover images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cover-images',
  'cover-images',
  true, -- Public bucket - can be accessed directly
  10485760, -- 10MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Avatars bucket: Public bucket for user profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Public bucket - can be accessed directly
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Temp uploads bucket: Private bucket for temporary file uploads
-- Files should be moved to final destination within 24 hours
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'temp-uploads',
  'temp-uploads',
  false, -- Private bucket
  524288000, -- 500MB in bytes (same as product-files)
  NULL -- Allow all mime types for temp uploads
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES - PRODUCT FILES
-- ============================================================================

-- Product files: No direct access (must use signed URLs)
-- This policy prevents direct access to product files
CREATE POLICY "Product files require signed URL"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-files' AND false); -- Always false = no direct access

-- Product files: Creators can upload files to their own folder
-- Files are stored in format: {creator_id}/{product_id}/{filename}
-- Note: This uses auth.uid() which requires Supabase Auth. For Clerk integration,
-- we'll need to use a different approach in the application layer.
CREATE POLICY "Creators can upload product files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-files' AND
    (auth.uid()::text = (string_to_array(name, '/'))[1] OR auth.role() = 'service_role')
  );

-- Product files: Creators can update their own files
CREATE POLICY "Creators can update own product files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-files' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Product files: Creators can delete their own files
CREATE POLICY "Creators can delete own product files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-files' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- ============================================================================
-- STORAGE POLICIES - COVER IMAGES
-- ============================================================================

-- Cover images: Public read access
CREATE POLICY "Public can view cover images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cover-images');

-- Cover images: Creators can upload to their own folder
-- Files are stored in format: {creator_id}/{product_id}/{filename}
CREATE POLICY "Creators can upload cover images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cover-images' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Cover images: Creators can update their own images
CREATE POLICY "Creators can update own cover images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'cover-images' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Cover images: Creators can delete their own images
CREATE POLICY "Creators can delete own cover images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cover-images' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- ============================================================================
-- STORAGE POLICIES - AVATARS
-- ============================================================================

-- Avatars: Public read access
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Avatars: Users can upload their own avatar
-- Files are stored in format: {user_id}/{filename}
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Avatars: Users can update their own avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Avatars: Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- ============================================================================
-- STORAGE POLICIES - TEMP UPLOADS
-- ============================================================================

-- Temp uploads: No public access (private bucket)
CREATE POLICY "No public access to temp uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'temp-uploads' AND false); -- Always false = no direct access

-- Temp uploads: Authenticated users can upload
-- Files are stored in format: {user_id}/{timestamp}/{filename}
CREATE POLICY "Authenticated users can upload temp files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'temp-uploads' AND
    auth.uid() IS NOT NULL
  );

-- Temp uploads: Users can update their own temp files
CREATE POLICY "Users can update own temp files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'temp-uploads' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Temp uploads: Users can delete their own temp files
CREATE POLICY "Users can delete own temp files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'temp-uploads' AND
    auth.uid()::text = (string_to_array(name, '/'))[1]
  );

COMMIT;

