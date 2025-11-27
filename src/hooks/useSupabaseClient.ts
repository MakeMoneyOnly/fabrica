'use client'

import { useSession } from '@clerk/nextjs'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import { useMemo } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Hook to create a Supabase client authenticated with the current Clerk session
 *
 * This hook uses Clerk's native Supabase integration (not deprecated JWT templates).
 * It automatically passes the Clerk session token to Supabase for each request,
 * allowing RLS policies to recognize the authenticated user.
 *
 * @returns Supabase client with Clerk authentication
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const supabase = useSupabaseClient()
 *
 *   const fetchData = async () => {
 *     const { data, error } = await supabase
 *       .from('users')
 *       .select('*')
 *     // RLS policies will have access to auth.jwt() ->> 'sub'
 *   }
 * }
 * ```
 */
export function useSupabaseClient(): SupabaseClient {
  const { session } = useSession()

  // Create a Supabase client with a function that gets the session token
  const client = useMemo(() => {
    if (!session) {
      // Return unauthenticated client if no session
      return createSupabaseClient()
    }

    // Return authenticated client with token getter function
    return createSupabaseClient(async () => {
      // Get the session token from Clerk
      // This will be injected into all Supabase requests
      const token = await session.getToken()
      console.log('🔌 Injecting Clerk token into Supabase client', token ? '(found)' : '(missing)')
      return token
    })
  }, [session])

  return client
}
