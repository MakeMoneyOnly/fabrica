'use client'

import { useOnboardingStore } from '@/stores/onboarding-store'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { currentStep, steps } = useOnboardingStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const currentIndex = steps.indexOf(currentStep)
  const progress = ((currentIndex + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header / Progress Bar */}
      <div className="w-full bg-white border-b border-gray-200 fixed top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-gray-900">Fabrica</div>
          <div className="text-sm font-medium text-gray-500">
            Step {currentIndex + 1} of {steps.length}
          </div>
        </div>
        {/* Progress Line */}
        <div className="h-1 w-full bg-gray-100">
          <motion.div
            className="h-full bg-black"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
