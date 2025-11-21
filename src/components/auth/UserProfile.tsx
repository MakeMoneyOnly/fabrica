'use client'

import { UserProfile as ClerkUserProfile } from '@clerk/nextjs'

export function UserProfile() {
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
