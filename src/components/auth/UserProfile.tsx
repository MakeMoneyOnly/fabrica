'use client'

import { UserProfile as ClerkUserProfile } from '@clerk/nextjs'

export function UserProfile() {
  const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!hasClerkKey) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600 text-sm">
          User profile not available - authentication not configured
        </p>
      </div>
    )
  }

  return (
    <ClerkUserProfile
      path="/profile"
      routing="path"
      appearance={{
        elements: {
          card: 'shadow-lg rounded-lg',
          navbar: 'bg-gray-50',
          pageScrollBox: 'p-4',
        },
      }}
    />
  )
}
