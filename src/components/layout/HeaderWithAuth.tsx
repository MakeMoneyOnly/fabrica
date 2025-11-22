'use client'

/**
 * Header component that uses Clerk authentication
 * This component should only be rendered when ClerkProvider is present
 */
import { Header } from './Header'
import { useAuth } from '@/hooks/useAuth'

export function HeaderWithAuth() {
  // Use Clerk hooks - these will throw if ClerkProvider is not present
  // This component should only be rendered when ClerkProvider exists
  const { isAuthenticated } = useAuth()

  // Pass authentication state to Header
  return <Header isAuthenticated={isAuthenticated} />
}
