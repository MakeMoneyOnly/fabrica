import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

/**
 * Creates a Supabase client for browser-side operations with Clerk integration
 *
 * This uses Clerk's native Supabase integration (not deprecated JWT templates).
 * The session token is automatically injected into Supabase requests.
 *
 * @param getToken - Function to get the Clerk session token (from useSession hook)
 * @returns Supabase browser client with Clerk authentication
 */
export function createClient(getToken?: () => Promise<string | null>) {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!getToken) {
    // Return basic client without authentication
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  // Return authenticated client with Clerk session token
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    global: {
      async fetch(url, options = {}) {
        const token = await getToken()
        const headers = new Headers(options?.headers)

        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }

        return fetch(url, {
          ...options,
          headers,
        })
      },
    },
  })
}

/**
 * Basic Supabase client without authentication
 * Use this for public operations or when you don't need user context
 */
export const supabase = createClient()
