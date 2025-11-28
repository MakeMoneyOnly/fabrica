'use client'

/**
 * Header component that uses Clerk authentication
 * This component should only be rendered when ClerkProvider is present
 */
import { Header } from './Header'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@clerk/nextjs'

export function HeaderWithAuth() {
  // Use Clerk hooks - these will throw if ClerkProvider is not present
  // This component should only be rendered when ClerkProvider exists
  const { isAuthenticated } = useAuth()
  const { user } = useUser()

  // Extract user data for the header
  const userData = user
    ? {
        name: user.fullName || user.firstName || undefined,
        email: user.primaryEmailAddress?.emailAddress || undefined,
        avatar: user.imageUrl || undefined,
      }
    : undefined

  // Pass authentication state and user data to Header
  return <Header isAuthenticated={isAuthenticated} user={userData} />
}
