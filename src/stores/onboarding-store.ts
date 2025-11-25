import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OnboardingStep = 'username' | 'profile' | 'payment' | 'product' | 'preview'

interface OnboardingState {
  currentStep: OnboardingStep
  steps: OnboardingStep[]
  userData: {
    username: string
    fullName: string
    bio: string
    avatarUrl: string | null
  }
  paymentData: {
    provider: 'chapa' | 'telebirr' | null
    accountNumber: string
    accountName: string
  }
  productData: {
    title: string
    description: string
    price: string
    type: 'digital' | 'booking' | 'link'
  }

  // Actions
  setStep: (step: OnboardingStep) => void
  nextStep: () => void
  prevStep: () => void
  updateUserData: (data: Partial<OnboardingState['userData']>) => void
  updatePaymentData: (data: Partial<OnboardingState['paymentData']>) => void
  updateProductData: (data: Partial<OnboardingState['productData']>) => void
  reset: () => void
}

const STEPS: OnboardingStep[] = ['username', 'profile', 'payment', 'product', 'preview']

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: 'username',
      steps: STEPS,
      userData: {
        username: '',
        fullName: '',
        bio: '',
        avatarUrl: null,
      },
      paymentData: {
        provider: null,
        accountNumber: '',
        accountName: '',
      },
      productData: {
        title: '',
        description: '',
        price: '',
        type: 'digital',
      },

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep, steps } = get()
        const currentIndex = steps.indexOf(currentStep)
        if (currentIndex < steps.length - 1) {
          set({ currentStep: steps[currentIndex + 1] })
        }
      },

      prevStep: () => {
        const { currentStep, steps } = get()
        const currentIndex = steps.indexOf(currentStep)
        if (currentIndex > 0) {
          set({ currentStep: steps[currentIndex - 1] })
        }
      },

      updateUserData: (data) => set((state) => ({ userData: { ...state.userData, ...data } })),

      updatePaymentData: (data) =>
        set((state) => ({ paymentData: { ...state.paymentData, ...data } })),

      updateProductData: (data) =>
        set((state) => ({ productData: { ...state.productData, ...data } })),

      reset: () =>
        set({
          currentStep: 'username',
          userData: { username: '', fullName: '', bio: '', avatarUrl: null },
          paymentData: { provider: null, accountNumber: '', accountName: '' },
          productData: { title: '', description: '', price: '', type: 'digital' },
        }),
    }),
    {
      name: 'fabrica-onboarding-storage',
    }
  )
)
