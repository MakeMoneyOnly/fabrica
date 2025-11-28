import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createStorageBuckets() {
  console.log('🚀 Creating storage buckets...\n')

  const buckets = [
    {
      id: 'avatars',
      name: 'avatars',
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    {
      id: 'cover-images',
      name: 'cover-images',
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    },
    {
      id: 'product-files',
      name: 'product-files',
      public: false,
      fileSizeLimit: 52428800, // 50MB (Supabase free tier limit)
      allowedMimeTypes: null, // Allow all types
    },
  ]

  for (const bucket of buckets) {
    console.log(`📦 Creating bucket: ${bucket.id}`)

    // Check if bucket exists
    const { data: existingBuckets } = await supabase.storage.listBuckets()
    const exists = existingBuckets?.some((b) => b.id === bucket.id)

    if (exists) {
      console.log(`   ✓ Bucket "${bucket.id}" already exists\n`)
      continue
    }

    // Create bucket
    const { data: _data, error } = await supabase.storage.createBucket(bucket.id, {
      public: bucket.public,
      fileSizeLimit: bucket.fileSizeLimit,
      allowedMimeTypes: bucket.allowedMimeTypes,
    })

    if (error) {
      console.error(`   ✗ Failed to create bucket "${bucket.id}":`, error.message)
    } else {
      console.log(`   ✓ Created bucket "${bucket.id}" successfully`)
      console.log(`     - Public: ${bucket.public}`)
      console.log(`     - Size limit: ${(bucket.fileSizeLimit / 1024 / 1024).toFixed(0)}MB\n`)
    }
  }

  console.log('✅ Storage bucket setup complete!\n')
}

// Run the setup
createStorageBuckets()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
