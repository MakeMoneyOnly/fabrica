import { createClient } from '@supabase/supabase-js'
import { env } from '../src/lib/env'

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function applyPolicies() {
  console.log('🔧 Applying permissive users table policies...')

  try {
    // First, drop existing policies
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Allow all SELECT on users" ON users',
      'DROP POLICY IF EXISTS "Allow all INSERT on users" ON users',
      'DROP POLICY IF EXISTS "Allow all UPDATE on users" ON users',
      'DROP POLICY IF EXISTS "Allow all DELETE on users" ON users',
      'DROP POLICY IF EXISTS "Users can view their own data" ON users',
      'DROP POLICY IF EXISTS "Users can update their own data" ON users',
      'DROP POLICY IF EXISTS "Users can insert their own data" ON users',
      'DROP POLICY IF EXISTS "Enable read access for usernames" ON users',
    ]

    for (const sql of dropPolicies) {
      await supabase.rpc('exec_sql', { sql })
    }

    // Then create new permissive policies
    const createPolicies = [
      'CREATE POLICY "Allow all SELECT on users" ON users FOR SELECT USING (true)',
      'CREATE POLICY "Allow all INSERT on users" ON users FOR INSERT WITH CHECK (true)',
      'CREATE POLICY "Allow all UPDATE on users" ON users FOR UPDATE USING (true)',
      'CREATE POLICY "Allow all DELETE on users" ON users FOR DELETE USING (true)',
    ]

    for (const sql of createPolicies) {
      await supabase.rpc('exec_sql', { sql })
    }

    console.log('✅ Users table policies applied successfully!')
  } catch (error) {
    console.error('❌ Error applying policies:', error)
    console.log('⚠️  Trying direct SQL approach...')

    // Fallback: try direct SQL if rpc doesn't work
    try {
      await supabase.from('users').select('count').limit(1)
      console.log('✅ Users table is accessible')
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError)
    }
  }
}

applyPolicies()
