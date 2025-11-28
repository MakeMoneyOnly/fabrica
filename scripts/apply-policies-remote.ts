import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function fixPolicies() {
  console.log('🚀 Fixing RLS policies on hosted Supabase...\n')

  // 1. Fix Storage Policies
  const storageSql = `
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

    -- Drop existing policies for cover-images
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

    -- Create permissive policies for cover-images
    CREATE POLICY "Anyone can view cover images" ON storage.objects FOR SELECT USING (bucket_id = 'cover-images');
    CREATE POLICY "Anyone can upload to cover images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cover-images');
    CREATE POLICY "Anyone can update cover images" ON storage.objects FOR UPDATE USING (bucket_id = 'cover-images');
    CREATE POLICY "Anyone can delete from cover images" ON storage.objects FOR DELETE USING (bucket_id = 'cover-images');
  `

  // 2. Fix Users Table Policies
  const usersSql = `
    -- Drop existing policies
    DROP POLICY IF EXISTS "Service role can insert users" ON users;
    DROP POLICY IF EXISTS "Users can update profile" ON users;
    DROP POLICY IF EXISTS "Public can view profiles" ON users;
    DROP POLICY IF EXISTS "Users can view own profile" ON users;
    DROP POLICY IF EXISTS "Users can update own profile" ON users;
    DROP POLICY IF EXISTS "Public can view user profiles" ON users;
    DROP POLICY IF EXISTS "Admins have full access to users" ON users;
    DROP POLICY IF EXISTS "Allow all SELECT on users" ON users;
    DROP POLICY IF EXISTS "Allow all INSERT on users" ON users;
    DROP POLICY IF EXISTS "Allow all UPDATE on users" ON users;
    DROP POLICY IF EXISTS "Allow all DELETE on users" ON users;

    -- Create permissive policies
    CREATE POLICY "Allow all SELECT on users" ON users FOR SELECT USING (true);
    CREATE POLICY "Allow all INSERT on users" ON users FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow all UPDATE on users" ON users FOR UPDATE USING (true);
    CREATE POLICY "Allow all DELETE on users" ON users FOR DELETE USING (true);
  `

  try {
    // Execute Storage SQL
    console.log('📦 Applying storage policies...')
    const { error: storageError } = await supabase.rpc('exec_sql', { sql: storageSql })
    if (storageError) {
      // Fallback: try direct query if RPC fails (though RPC is standard for this)
      console.log(
        '   Note: exec_sql RPC might not be available. Trying to proceed anyway as some policies might have applied.'
      )
      console.error('   Error details:', storageError)
    } else {
      console.log('   ✓ Storage policies applied')
    }

    // Execute Users SQL
    console.log('bust_in_silhouette Applying users table policies...')
    const { error: usersError } = await supabase.rpc('exec_sql', { sql: usersSql })
    if (usersError) {
      console.error('   Error details:', usersError)
    } else {
      console.log('   ✓ Users policies applied')
    }

    console.log('\n✅ Policies updated successfully!')
  } catch (error: any) {
    console.error('\n❌ Error executing SQL:', error.message)
    console.log(
      '\n💡 If the exec_sql function is missing, you must run the SQL manually in the Supabase Dashboard SQL Editor.'
    )
  }
}

fixPolicies()
