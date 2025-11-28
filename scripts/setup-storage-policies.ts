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

async function setupStoragePolicies() {
  console.log('🔐 Setting up storage policies for Clerk authentication...\n')

  // Since we're using Clerk (not Supabase Auth), we need to allow authenticated uploads
  // The policies will be permissive for now - you can tighten them later with custom claims

  const policies = [
    // Avatars bucket - allow public read, authenticated write
    {
      name: 'Public can view avatars',
      bucket: 'avatars',
      operation: 'SELECT',
      sql: `CREATE POLICY "Public can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');`,
    },
    {
      name: 'Authenticated users can upload avatars',
      bucket: 'avatars',
      operation: 'INSERT',
      sql: `CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');`,
    },
    {
      name: 'Users can update avatars',
      bucket: 'avatars',
      operation: 'UPDATE',
      sql: `CREATE POLICY "Users can update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');`,
    },
    {
      name: 'Users can delete avatars',
      bucket: 'avatars',
      operation: 'DELETE',
      sql: `CREATE POLICY "Users can delete avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');`,
    },

    // Cover images bucket
    {
      name: 'Public can view cover images',
      bucket: 'cover-images',
      operation: 'SELECT',
      sql: `CREATE POLICY "Public can view cover images" ON storage.objects FOR SELECT USING (bucket_id = 'cover-images');`,
    },
    {
      name: 'Authenticated users can upload cover images',
      bucket: 'cover-images',
      operation: 'INSERT',
      sql: `CREATE POLICY "Authenticated users can upload cover images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cover-images');`,
    },
    {
      name: 'Users can update cover images',
      bucket: 'cover-images',
      operation: 'UPDATE',
      sql: `CREATE POLICY "Users can update cover images" ON storage.objects FOR UPDATE USING (bucket_id = 'cover-images');`,
    },
    {
      name: 'Users can delete cover images',
      bucket: 'cover-images',
      operation: 'DELETE',
      sql: `CREATE POLICY "Users can delete cover images" ON storage.objects FOR DELETE USING (bucket_id = 'cover-images');`,
    },

    // Product files bucket - private
    {
      name: 'No public access to product files',
      bucket: 'product-files',
      operation: 'SELECT',
      sql: `CREATE POLICY "No public access to product files" ON storage.objects FOR SELECT USING (bucket_id = 'product-files' AND false);`,
    },
    {
      name: 'Authenticated users can upload product files',
      bucket: 'product-files',
      operation: 'INSERT',
      sql: `CREATE POLICY "Authenticated users can upload product files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-files');`,
    },
  ]

  console.log('📝 Creating storage policies via SQL...\n')

  for (const policy of policies) {
    console.log(`   Creating: ${policy.name}`)

    const { error } = await supabase.rpc('exec_sql', { sql: policy.sql })

    if (error) {
      // Check if error is because policy already exists
      if (error.message.includes('already exists')) {
        console.log(`   ⚠️  Policy already exists, skipping`)
      } else {
        console.error(`   ✗ Failed:`, error.message)
      }
    } else {
      console.log(`   ✓ Created successfully`)
    }
  }

  console.log('\n✅ Storage policies setup complete!')
  console.log('\n⚠️  Note: These policies are permissive. Consider tightening them in production.')
}

// Run the setup
setupStoragePolicies()
  .then(() => {
    console.log('\nDone!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message)
    console.error('\n💡 You may need to create these policies manually in the Supabase dashboard:')
    console.error('   1. Go to Storage > Policies')
    console.error('   2. For each bucket, add policies to allow INSERT, UPDATE, DELETE')
    console.error("   3. Use simple conditions like: bucket_id = 'avatars'")
    process.exit(1)
  })
