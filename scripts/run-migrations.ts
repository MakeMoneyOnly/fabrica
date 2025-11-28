import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

// Note: supabase client created but not used - using REST API directly
const _supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function runMigrations() {
  console.log('🚀 Running database migrations...\n')

  const migrations = [
    'supabase/migrations/20251122143356_initial_schema.sql',
    'supabase/migrations/20251122153751_storage_buckets.sql',
  ]

  for (const migrationPath of migrations) {
    console.log(`📄 Running: ${migrationPath}`)

    try {
      const sql = readFileSync(migrationPath, 'utf-8')

      // Split by semicolons and execute each statement
      const statements = sql
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith('--'))

      console.log(`   Found ${statements.length} SQL statements`)

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i]
        if (statement.length < 10) {
          continue // Skip very short statements
        }

        try {
          // Use the REST API to execute SQL
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: supabaseServiceKey,
              Authorization: `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({ sql: statement + ';' }),
          })

          if (!response.ok) {
            const error = await response.text()
            if (error.includes('already exists')) {
              // Ignore "already exists" errors
              continue
            }
            console.error(`   ✗ Statement ${i + 1} failed:`, error.substring(0, 200))
          }
        } catch (err: unknown) {
          const error = err as Error
          if (error.message?.includes('already exists')) {
            continue
          }
          console.error(`   ✗ Statement ${i + 1} error:`, error.message?.substring(0, 200))
        }
      }

      console.log(`   ✓ Migration completed\n`)
    } catch (error: unknown) {
      const err = error as Error
      console.error(`   ✗ Failed to read migration file:`, err.message)
    }
  }

  console.log('✅ Migrations complete!\n')
}

// Run migrations
runMigrations()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
