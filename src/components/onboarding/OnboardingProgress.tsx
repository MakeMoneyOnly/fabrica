'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OnboardingStep } from '@/stores/onboarding-store'
import { motion } from 'framer-motion'

interface OnboardingProgressProps {
  currentStep: OnboardingStep
  completedSteps?: Set<OnboardingStep>
}

const steps: Array<{ name: OnboardingStep; title: string; description: string }> = [
  { name: 'username', title: 'Username', description: 'Claim URL' },
  { name: 'profile', title: 'Profile', description: 'Your Info' },
  { name: 'payment', title: 'Payment', description: 'Get Paid' },
  { name: 'product', title: 'Product', description: 'First Item' },
  { name: 'preview', title: 'Launch', description: 'Go Live' },
] as const

export function OnboardingProgress({ currentStep, completedSteps }: OnboardingProgressProps) {
  const currentIndex = steps.findIndex((step) => step.name === currentStep)

  return (
    <div className="w-full py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Progress bar */}
        <div className="relative">
          {/* Background line */}
          <div className="absolute left-0 top-5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-full bg-slate-100" />
          </div>

          {/* Progress line */}
          <motion.div
            className="absolute left-0 top-5 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${(currentIndex / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = completedSteps?.has(step.name) || false
              const isCurrent = currentStep === step.name
              const _isPast = currentIndex > index

              return (
                <div key={step.name} className="flex flex-col items-center group cursor-default">
                  {/* Step circle */}
                  <motion.div
                    className={cn(
                      'relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 z-10',
                      {
                        'border-transparent bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 scale-110':
                          isCurrent,
                        'border-transparent bg-slate-700 text-white': isCompleted,
                        'border-slate-200 bg-white text-slate-400': !isCurrent && !isCompleted,
                      }
                    )}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}

                    {/* Pulse effect for current step */}
                    {isCurrent && (
                      <span className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                    )}
                  </motion.div>

                  {/* Step label */}
                  <div className="mt-3 text-center">
                    <p
                      className={cn(
                        'text-xs font-bold uppercase tracking-wider transition-colors duration-300',
                        {
                          'text-slate-900': isCurrent || isCompleted,
                          'text-slate-400': !isCurrent && !isCompleted,
                        }
                      )}
                    >
                      {step.title}
                    </p>
                    <p
                      className={cn(
                        'mt-0.5 hidden text-[10px] font-medium sm:block transition-colors duration-300',
                        {
                          'text-slate-500': isCurrent || isCompleted,
                          'text-slate-300': !isCurrent && !isCompleted,
                        }
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
