import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/**
 * Creates a Supabase admin client with service role key
 *
 * This client bypasses Row Level Security (RLS) and should ONLY be used:
 * - In server-side scripts (seed scripts, migrations, admin operations)
 * - Never in client-side code or API routes that handle user requests
 * - Only when you need to perform operations that require elevated privileges
 *
 * @throws {Error} If required environment variables are not set
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase admin environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
    )
  }

  const client = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Set the schema explicitly for PostgREST
  // This ensures the client knows which schema to query
  return client
}

/**
 * Admin Supabase client instance (lazy-loaded)
 *
 * WARNING: This client has full database access and bypasses RLS.
 * Only use in server-side scripts and admin operations.
 *
 * This is lazy-loaded to prevent errors when environment variables
 * are not set during module import (e.g., in development).
 */
let _adminClient: ReturnType<typeof createAdminClient> | null = null

export function getAdminClient() {
  if (!_adminClient) {
    _adminClient = createAdminClient()
  }
  return _adminClient
}

/**
 * @deprecated Use getAdminClient() instead to avoid initialization errors
 * This export is kept for backward compatibility but will throw if env vars are not set
 */
export const adminClient = new Proxy({} as ReturnType<typeof createAdminClient>, {
  get(_target, prop) {
    return getAdminClient()[prop as keyof ReturnType<typeof createAdminClient>]
  },
})
