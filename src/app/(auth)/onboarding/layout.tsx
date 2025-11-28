'use client'

import { useOnboardingStore } from '@/stores/onboarding-store'
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { currentStep, userData } = useOnboardingStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Calculate completed steps based on user data
  const completedSteps = new Set<typeof currentStep>()
  if (userData.username) {
    completedSteps.add('username')
  }
  if (userData.fullName) {
    completedSteps.add('profile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-100/30 blur-3xl" />
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-slate-200/20 blur-3xl" />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-amber-50/40 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header / Progress */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
          <div className="container mx-auto px-4">
            <OnboardingProgress currentStep={currentStep} completedSteps={completedSteps} />
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-white/50 p-6 sm:p-10"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
