-- Enable RLS on users table (just in case)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;

-- Policy 1: Allow users to view their own data
CREATE POLICY "Users can view their own data"
ON public.users
FOR SELECT
USING (
  auth.jwt() ->> 'sub' = clerk_user_id
);

-- Policy 2: Allow users to update their own data
CREATE POLICY "Users can update their own data"
ON public.users
FOR UPDATE
USING (
  auth.jwt() ->> 'sub' = clerk_user_id
);

-- Policy 3: Allow users to insert their own data
CREATE POLICY "Users can insert their own data"
ON public.users
FOR INSERT
WITH CHECK (
  auth.jwt() ->> 'sub' = clerk_user_id
);

-- Policy 4: Allow ANYONE to check if a username exists (Critical for onboarding)
-- We restrict this to only selecting the 'username' column if possible, but RLS is row-based.
-- So we allow reading rows, but the application only selects the username.
CREATE POLICY "Enable read access for usernames"
ON public.users
FOR SELECT
USING (true); 
-- Note: This makes user profiles public. If you want to restrict this, 
-- you can use (auth.role() = 'authenticated') but for username availability check 
-- during onboarding, we might need it to be open or at least authenticated.
