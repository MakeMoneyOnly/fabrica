-- Check RLS policies on users table
select * from pg_policies where tablename = 'users';

-- Check if RLS is enabled on users table
select relname, relrowsecurity from pg_class where relname = 'users';
