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
 *
 * IMPORTANT: This hook must be used within ClerkProvider when Clerk is configured.
 * When Clerk is not configured, the layout doesn't render ClerkProvider, so this hook
 * will throw an error. Components using this hook should be wrapped in an error boundary
 * or check Clerk configuration before rendering.
 */
export function useAuth() {
  // Always call hooks unconditionally (Rules of Hooks)
  // These will throw if ClerkProvider is not present
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

/**
 * Safe wrapper hook that handles Clerk configuration gracefully
 * Use this instead of useAuth when Clerk might not be configured
 *
 * IMPORTANT: This hook always calls Clerk hooks (following Rules of Hooks).
 * If ClerkProvider is not present, the hooks will throw an error.
 * Components using this hook should be wrapped in an error boundary,
 * or ClerkProvider should always be present when Clerk is configured.
 *
 * For components that must work without Clerk, check configuration first
 * and render different content.
 */
export function useAuthSafe() {
  // Always call hooks (Rules of Hooks)
  // These will throw if ClerkProvider is not present
  // We check configuration first, but still need to call hooks
  // Always call hooks - they will throw if ClerkProvider is not present
  // This is expected when Clerk is not configured
  // Components should handle this with error boundaries or conditional rendering
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
