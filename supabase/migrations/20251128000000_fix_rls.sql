-- Enable RLS on tables reported as insecure
-- Using IF EXISTS to handle potential discrepancies between local and remote schema

-- Enable RLS on 'users' table (explicitly mentioned in errors)
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on 'bookings' table (explicitly mentioned in errors)
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;

-- Enable RLS on 'analytics' table (explicitly mentioned in errors)
ALTER TABLE IF EXISTS public.analytics ENABLE ROW LEVEL SECURITY;

-- Ensure 'analytics_events' also has RLS enabled (from local schema)
ALTER TABLE IF EXISTS public.analytics_events ENABLE ROW LEVEL SECURITY;
