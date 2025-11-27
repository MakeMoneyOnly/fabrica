-- Clean setup for users table
-- Run this in Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can insert users" ON users;
DROP POLICY IF EXISTS "Users can update profile" ON users;
DROP POLICY IF EXISTS "Public can view profiles" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Public can view user profiles" ON users;
DROP POLICY IF EXISTS "Admins have full access to users" ON users;

-- Create users table if it doesn't exist
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

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create simple, permissive policies for Clerk authentication
-- These allow all operations - you can tighten them later

CREATE POLICY "Allow all SELECT on users"
    ON users FOR SELECT
    USING (true);

CREATE POLICY "Allow all INSERT on users"
    ON users FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow all UPDATE on users"
    ON users FOR UPDATE
    USING (true);

CREATE POLICY "Allow all DELETE on users"
    ON users FOR DELETE
    USING (true);
