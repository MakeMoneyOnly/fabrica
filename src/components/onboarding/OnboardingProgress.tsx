'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OnboardingStep } from '@/stores/onboarding-store'

interface OnboardingProgressProps {
  currentStep: OnboardingStep
  completedSteps?: Set<OnboardingStep>
}

const steps: Array<{ name: OnboardingStep; title: string; description: string }> = [
  { name: 'username', title: 'Username', description: 'Choose your unique username' },
  { name: 'profile', title: 'Profile', description: 'Set up your profile' },
  { name: 'payment', title: 'Payment', description: 'Connect payment account' },
  { name: 'product', title: 'Product', description: 'Create your first product' },
  { name: 'preview', title: 'Launch', description: 'Preview and launch' },
] as const

export function OnboardingProgress({ currentStep, completedSteps }: OnboardingProgressProps) {
  const currentIndex = steps.findIndex((step) => step.name === currentStep)

  return (
    <div className="w-full py-8">
      <div className="mx-auto max-w-4xl">
        {/* Progress bar */}
        <div className="relative">
          {/* Background line */}
          <div className="absolute left-0 top-5 h-0.5 w-full bg-gray-200" />

          {/* Progress line */}
          <div
            className="absolute left-0 top-5 h-0.5 bg-primary-600 transition-all duration-500"
            style={{
              width: `${(currentIndex / (steps.length - 1)) * 100}%`,
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = completedSteps?.has(step.name) || false
              const isCurrent = currentStep === step.name
              const isPast = currentIndex > index

              return (
                <div key={step.name} className="flex flex-col items-center">
                  {/* Step circle */}
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition-all duration-300',
                      {
                        'border-primary-600 bg-primary-600 text-white': isCurrent || isCompleted,
                        'border-gray-300 text-gray-500': !isCurrent && !isCompleted && !isPast,
                        'border-primary-600 text-primary-600': isPast && !isCompleted,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>

                  {/* Step label */}
                  <div className="mt-2 text-center">
                    <p
                      className={cn('text-sm font-medium', {
                        'text-primary-600': isCurrent || isCompleted,
                        'text-gray-500': !isCurrent && !isCompleted,
                      })}
                    >
                      {step.title}
                    </p>
                    <p className="mt-0.5 hidden text-xs text-gray-500 sm:block">
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
