import { createClient } from '@supabase/supabase-js'
import { env } from '../src/lib/env'

const publicSupabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function testUsernameCheck() {
  console.log('🧪 Testing username availability check...')

  const testUsernames = ['testuser', 'admin', 'user123']

  for (const username of testUsernames) {
    try {
      console.log(`\n📝 Checking username: ${username}`)
      const { data, error } = await publicSupabase
        .from('users')
        .select('username')
        .eq('username', username)
        .limit(1)

      if (error) {
        console.error('❌ Error:', error)
        return
      }

      if (data && data.length > 0) {
        console.log('❌ Username taken:', data[0].username)
      } else {
        console.log('✅ Username available')
      }
    } catch (err) {
      console.error('💥 Unexpected error:', err)
    }
  }

  console.log('\n✅ Test completed!')
}

testUsernameCheck()
