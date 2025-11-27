-- Create public.users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL UNIQUE,
  email TEXT,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Re-apply policies (just to be safe)
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Enable read access for usernames" ON public.users;

CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.jwt() ->> 'sub' = clerk_user_id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.jwt() ->> 'sub' = clerk_user_id);
CREATE POLICY "Users can insert their own data" ON public.users FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = clerk_user_id);
CREATE POLICY "Enable read access for usernames" ON public.users FOR SELECT USING (true);

-- Grant access to authenticated and anon users
GRANT ALL ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
