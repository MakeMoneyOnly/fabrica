'use client'

import { SignUpButton as ClerkSignUpButton } from '@clerk/nextjs'

export function SignUpButton() {
  const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!hasClerkKey) {
    return (
      <button
        className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
        disabled
        title="Authentication not configured"
      >
        Sign Up (Not Configured)
      </button>
    )
  }

  return (
    <ClerkSignUpButton mode="modal">
      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        Sign Up
      </button>
    </ClerkSignUpButton>
  )
}
