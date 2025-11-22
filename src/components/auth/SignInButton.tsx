'use client'

import { SignInButton as ClerkSignInButton } from '@clerk/nextjs'

export function SignInButton() {
  const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!hasClerkKey) {
    return (
      <button
        className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
        disabled
        title="Authentication not configured"
      >
        Sign In (Not Configured)
      </button>
    )
  }

  return (
    <ClerkSignInButton mode="modal">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Sign In
      </button>
    </ClerkSignInButton>
  )
}
