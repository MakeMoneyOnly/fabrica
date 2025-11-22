'use client'

import { useAuth as useClerkAuth, useUser, useClerk } from '@clerk/nextjs'

interface User {
  id: string
  email: string | null
  name: string | null
}

/**
 * Custom hook that wraps Clerk's useAuth and maps it to our application's user interface
 * This provides a consistent API for authentication throughout the app
 */
export function useAuth() {
  const { userId, isSignedIn } = useClerkAuth()
  const { user: clerkUser } = useUser()
  const { signOut } = useClerk()

  // Map Clerk user to application user interface
  const user: User | null =
    clerkUser && userId
      ? {
          id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || null,
          name: clerkUser.fullName || clerkUser.username || null,
        }
      : null

  return {
    user,
    isAuthenticated: isSignedIn || false,
    signOut: signOut ? () => signOut() : undefined,
  }
}
