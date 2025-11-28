-- Fix Onboarding Flow Policies (Users & Storage)
-- Run this in the Supabase SQL Editor

-- 1. Ensure Users Table Exists
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    social_links JSONB DEFAULT '{}',
    subscription_plan TEXT DEFAULT 'trial',
    subscription_status TEXT DEFAULT 'active',
    trial_ends_at TIMESTAMP,
    subscription_current_period_end TIMESTAMP,
    telebirr_account TEXT,
    telebirr_verified BOOLEAN DEFAULT FALSE,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create Indexes
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. Enable RLS on Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Create Permissive Policies for Users (since we use Clerk)
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all SELECT on users" ON users;
DROP POLICY IF EXISTS "Allow all INSERT on users" ON users;
DROP POLICY IF EXISTS "Allow all UPDATE on users" ON users;
DROP POLICY IF EXISTS "Allow all DELETE on users" ON users;
DROP POLICY IF EXISTS "Service role can insert users" ON users;
DROP POLICY IF EXISTS "Users can update profile" ON users;
DROP POLICY IF EXISTS "Public can view profiles" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Public can view user profiles" ON users;
DROP POLICY IF EXISTS "Admins have full access to users" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Enable read access for usernames" ON users;

CREATE POLICY "Allow all SELECT on users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow all INSERT on users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all UPDATE on users" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow all DELETE on users" ON users FOR DELETE USING (true);

-- 5. Ensure Storage Buckets Exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('cover-images', 'cover-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Fix Storage Policies
-- Drop existing policies
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
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from avatars" ON storage.objects;

-- Create permissive policies for avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Anyone can upload to avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Anyone can update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');
CREATE POLICY "Anyone can delete from avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');

-- Same for cover-images
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

CREATE POLICY "Anyone can view cover images" ON storage.objects FOR SELECT USING (bucket_id = 'cover-images');
CREATE POLICY "Anyone can upload to cover images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cover-images');
CREATE POLICY "Anyone can update cover images" ON storage.objects FOR UPDATE USING (bucket_id = 'cover-images');
CREATE POLICY "Anyone can delete from cover images" ON storage.objects FOR DELETE USING (bucket_id = 'cover-images');
