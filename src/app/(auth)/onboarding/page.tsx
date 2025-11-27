'use client'

import { useOnboardingStore } from '@/stores/onboarding-store'
import StepUsername from '@/components/onboarding/step-username'
import StepProfile from '@/components/onboarding/step-profile'
import StepPayment from '@/components/onboarding/step-payment'
import StepProduct from '@/components/onboarding/step-product'
import StepPreview from '@/components/onboarding/step-preview'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OnboardingPage() {
  const { currentStep } = useOnboardingStore()
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  // Redirect to home if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.warn('User not signed in, redirecting to home page')
      router.push('/')
    }
  }, [isLoaded, isSignedIn, router])

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render onboarding if not signed in
  if (!isSignedIn) {
    return null
  }

  switch (currentStep) {
    case 'username':
      return <StepUsername />
    case 'profile':
      return <StepProfile />
    case 'payment':
      return <StepPayment />
    case 'product':
      return <StepProduct />
    case 'preview':
      return <StepPreview />
    default:
      return <StepUsername />
  }
}
