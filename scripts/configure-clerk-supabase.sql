-- Configure Supabase to work with Clerk's Native Integration
-- This script sets up RLS policies for Clerk's modern third-party auth integration
-- (Not using deprecated JWT templates)

-- ============================================================================
-- IMPORTANT: Before running this script, you MUST configure Clerk in Supabase
-- ============================================================================
-- 1. Go to Clerk Dashboard → https://dashboard.clerk.com/setup/supabase
-- 2. Click "Activate Supabase integration" and copy your Clerk domain
-- 3. Go to Supabase Dashboard → Authentication → Third-Party Auth
-- 4. Add Clerk as a provider and paste your Clerk domain
-- 5. Save the configuration
--
-- This allows Supabase to verify Clerk session tokens automatically.
-- ============================================================================

-- ============================================================================
-- PART 1: Update Users Table RLS Policies
-- ============================================================================

-- Drop all existing policies
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', pol.policyname);
    END LOOP;
END $$;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view user profiles (for public stores)
CREATE POLICY "Public can view user profiles"
ON public.users
FOR SELECT
USING (true);

-- Policy: Authenticated users can insert their own profile
-- auth.jwt() ->> 'sub' contains the Clerk user ID
CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.jwt() ->> 'sub' = clerk_user_id);

-- Policy: Authenticated users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'sub' = clerk_user_id)
WITH CHECK (auth.jwt() ->> 'sub' = clerk_user_id);

-- Policy: Service role can do everything (for webhooks)
CREATE POLICY "Service role has full access"
ON public.users
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- PART 2: Update Storage Policies for Avatars and Cover Images
-- ============================================================================

-- Drop existing policies on storage.objects (if they exist)
-- Note: We drop them individually to avoid permission issues
DROP POLICY IF EXISTS "Anyone can view avatars and covers" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Service role has full storage access" ON storage.objects;

-- Also drop any old policies that might exist
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
DROP POLICY IF EXISTS "Anyone can upload to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public can view cover images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload cover images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update cover images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete cover images" ON storage.objects;
DROP POLICY IF EXISTS "Allow cover uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow cover updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow cover deletes" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view cover images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to cover images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update cover images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from cover images" ON storage.objects;
DROP POLICY IF EXISTS "Universal Access to Avatars and Covers" ON storage.objects;

-- Note: RLS is already enabled on storage.objects by default in Supabase
-- No need to run: ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Ensure buckets exist and are public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/*'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('cover-images', 'cover-images', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/*'];

-- Policy: Anyone can view public images
CREATE POLICY "Anyone can view avatars and covers"
ON storage.objects
FOR SELECT
USING (bucket_id IN ('avatars', 'cover-images'));

-- Policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('avatars', 'cover-images'));

-- Policy: Authenticated users can update their own images
-- Images are named with user ID prefix, so we check the name starts with their ID
CREATE POLICY "Users can update own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id IN ('avatars', 'cover-images')
    AND name LIKE (auth.jwt() ->> 'sub') || '%'
);

-- Policy: Authenticated users can delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id IN ('avatars', 'cover-images')
    AND name LIKE (auth.jwt() ->> 'sub') || '%'
);

-- Policy: Service role can do everything (for admin operations)
CREATE POLICY "Service role has full storage access"
ON storage.objects
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these to verify the setup:

-- 1. Check users table policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- 2. Check storage policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'objects'
ORDER BY policyname;

-- 3. Check buckets configuration
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id IN ('avatars', 'cover-images');

-- 4. Test auth.jwt() function (run this after signing in)
-- SELECT auth.jwt();
-- Should return a JSON object with 'sub' containing your Clerk user ID
