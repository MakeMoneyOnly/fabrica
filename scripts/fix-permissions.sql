-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to users table
GRANT ALL ON TABLE public.users TO anon, authenticated;
GRANT ALL ON TABLE public.users TO service_role;

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
