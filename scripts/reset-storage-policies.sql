-- NUCLEAR OPTION: Reset all storage policies and permissions
-- Run this in Supabase SQL Editor

-- 1. Grant usage on storage schema to all roles
GRANT USAGE ON SCHEMA storage TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA storage TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO postgres, anon, authenticated, service_role;

-- 2. Ensure buckets exist and are public
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

-- 3. Drop ALL existing policies on storage.objects to start fresh
-- We use a DO block to iterate and drop them dynamically
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- 4. Create ONE simple, permissive policy for everything
-- This allows ANY operation on 'avatars' and 'cover-images' buckets for ANY role (anon/authenticated)
CREATE POLICY "Universal Access to Avatars and Covers"
ON storage.objects
FOR ALL
USING (bucket_id IN ('avatars', 'cover-images'))
WITH CHECK (bucket_id IN ('avatars', 'cover-images'));

-- 5. Verify RLS is enabled (it should be, but just in case)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 6. Fix Users table policies too (just in case)
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', pol.policyname);
    END LOOP;
END $$;

CREATE POLICY "Universal Access to Users"
ON public.users
FOR ALL
USING (true)
WITH CHECK (true);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
