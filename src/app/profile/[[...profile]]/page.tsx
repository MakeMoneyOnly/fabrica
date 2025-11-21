'use client'

import { UserProfile } from '@/components/auth'

export default function ProfilePage() {
  const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {hasClerkKey ? (
            <UserProfile />
          ) : (
            <div className="p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Authentication Not Configured
              </h2>
              <p className="text-gray-600 mb-4">
                Clerk authentication is not set up yet. Please configure your Clerk keys to enable
                user profiles.
              </p>
              <p className="text-sm text-gray-500">
                Set the NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable to enable
                authentication.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
