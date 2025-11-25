import { describe, it, expect, beforeEach } from 'vitest'
import { useOnboardingStore } from '@/stores/onboarding-store'

describe('Onboarding Store', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset()
  })

  it('should start at the username step', () => {
    expect(useOnboardingStore.getState().currentStep).toBe('username')
  })

  it('should advance to the next step', () => {
    useOnboardingStore.getState().nextStep()
    expect(useOnboardingStore.getState().currentStep).toBe('profile')
  })

  it('should go back to the previous step', () => {
    useOnboardingStore.getState().setStep('profile')
    useOnboardingStore.getState().prevStep()
    expect(useOnboardingStore.getState().currentStep).toBe('username')
  })

  it('should update user data', () => {
    useOnboardingStore.getState().updateUserData({ username: 'testuser' })
    expect(useOnboardingStore.getState().userData.username).toBe('testuser')
  })

  it('should update payment data', () => {
    useOnboardingStore.getState().updatePaymentData({ provider: 'chapa' })
    expect(useOnboardingStore.getState().paymentData.provider).toBe('chapa')
  })

  it('should update product data', () => {
    useOnboardingStore.getState().updateProductData({ title: 'My Product' })
    expect(useOnboardingStore.getState().productData.title).toBe('My Product')
  })

  it('should reset state', () => {
    useOnboardingStore.getState().updateUserData({ username: 'testuser' })
    useOnboardingStore.getState().nextStep()
    useOnboardingStore.getState().reset()

    expect(useOnboardingStore.getState().currentStep).toBe('username')
    expect(useOnboardingStore.getState().userData.username).toBe('')
  })
})
