'use client'

import { SignUpButton as ClerkSignUpButton } from '@clerk/nextjs'

export function SignUpButton() {
  return (
    <ClerkSignUpButton mode="modal">
      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        Sign Up
      </button>
    </ClerkSignUpButton>
  )
}
