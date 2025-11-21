'use client'

import { useUser } from '@clerk/nextjs'
import { SignInButton } from './SignInButton'
import { SignUpButton } from './SignUpButton'
import { UserProfile } from './UserProfile'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // Always call hooks before any conditional returns (Rules of Hooks)
  const { isLoaded, isSignedIn, user } = useUser()

  // If Clerk is not configured, show a message
  if (!hasClerkKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Authentication Not Configured</h1>
        <p className="text-gray-600 text-center max-w-md">
          Clerk authentication is not set up yet. Please configure your Clerk keys to enable user
          authentication and access control.
        </p>
        <p className="text-sm text-gray-500">
          Set the NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable to enable authentication.
        </p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Fabrica</h1>
          <p className="text-gray-600 mb-8">Please sign in to access your creator dashboard</p>
          <div className="flex space-x-4">
            <SignInButton />
            <SignUpButton />
          </div>
        </div>
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with user info */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-900">Fabrica Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || user?.username || 'Creator'}!
              </span>
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
