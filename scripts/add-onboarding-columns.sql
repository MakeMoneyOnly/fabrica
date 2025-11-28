-- Add missing onboarding columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Update existing users who might have completed onboarding
-- (This is optional - you can remove this if you don't want to retroactively mark users as completed)
-- UPDATE public.users SET onboarding_completed = TRUE WHERE username IS NOT NULL AND full_name IS NOT NULL;
