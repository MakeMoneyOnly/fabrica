'use client'

import { useOnboardingStore } from '@/stores/onboarding-store'
import StepUsername from '@/components/onboarding/step-username'
import StepProfile from '@/components/onboarding/step-profile'
import StepPayment from '@/components/onboarding/step-payment'
import StepProduct from '@/components/onboarding/step-product'
import StepPreview from '@/components/onboarding/step-preview'

export default function OnboardingPage() {
  const { currentStep } = useOnboardingStore()

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
