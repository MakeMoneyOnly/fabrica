import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

/**
 * Creates a Supabase client for browser-side operations
 *
 * This client is used in client components and browser contexts.
 * Environment variables must be prefixed with NEXT_PUBLIC_ to be
 * accessible in the browser.
 *
 * @throws {Error} If required environment variables are not set
 */
export function createClient() {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createClient()
