'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, Rocket, ExternalLink, Check } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export default function StepPreview() {
  const router = useRouter()
  const { user } = useUser()
  const { userData, productData, prevStep } = useOnboardingStore()
  const [isLaunching, setIsLaunching] = useState(false)

  const handleLaunch = async () => {
    if (!user) {
      return
    }

    setIsLaunching(true)

    try {
      // Mark onboarding as complete in Supabase
      const supabase = await createClient()
      const { error } = await supabase
        .from('users')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('clerk_user_id', user.id)

      if (error) {
        console.error('Error completing onboarding:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          clerkUserId: user.id,
        })
        alert(
          `Failed to complete onboarding: ${error.message || 'Unknown error'}. Please try again.`
        )
        setIsLaunching(false)
        return
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Unexpected error during onboarding completion:', {
        error: error instanceof Error ? error.message : error,
        clerkUserId: user.id,
        stack: error instanceof Error ? error.stack : undefined,
      })
      alert('An unexpected error occurred. Please try again.')
      setIsLaunching(false)
    }
  }

  const storefrontUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://fabrica.et'}/${userData.username}`

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">You're all set!</h2>
        <p className="mt-2 text-lg text-gray-600">Your storefront is ready to launch</p>
      </div>

      {/* Preview Card */}
      <div className="overflow-hidden rounded-lg border-2 border-gray-200 bg-white">
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6 text-white">
          <h3 className="text-lg font-semibold">Your Storefront Preview</h3>
          <p className="mt-1 text-sm text-gray-300">This is how customers will see your store</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-4">
            {userData.avatarUrl ? (
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={userData.avatarUrl}
                  alt={userData.fullName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-600">
                {userData.fullName?.charAt(0) || '?'}
              </div>
            )}
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900">
                {userData.fullName || 'Your Name'}
              </h4>
              <p className="mt-1 text-sm text-gray-600">@{userData.username}</p>
              <p className="mt-2 text-sm text-gray-700">
                {userData.bio || 'Your bio will appear here'}
              </p>
            </div>
          </div>

          {/* Product Preview */}
          {productData.title && (
            <div className="rounded-lg border border-gray-200 p-4">
              <h5 className="font-semibold text-gray-900">{productData.title}</h5>
              <p className="mt-1 text-sm text-gray-600">{productData.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">{productData.price} ETB</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {productData.type === 'digital' && 'Digital Product'}
                  {productData.type === 'booking' && '1-on-1 Booking'}
                  {productData.type === 'link' && 'External Link'}
                </span>
              </div>
            </div>
          )}

          {/* Storefront URL */}
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">Your storefront URL:</p>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 rounded bg-white px-3 py-2 text-sm text-gray-900 border border-gray-200">
                {storefrontUrl}
              </code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(storefrontUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="rounded-lg bg-blue-50 p-6">
        <h3 className="text-lg font-semibold text-blue-900">What's next?</h3>
        <ul className="mt-3 space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Share your storefront link with your audience</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Add more products and customize your store</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Track your sales and analytics in the dashboard</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Start earning from your digital products!</span>
          </li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          onClick={prevStep}
          variant="outline"
          disabled={isLaunching}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          type="button"
          onClick={handleLaunch}
          disabled={isLaunching}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isLaunching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Launching...
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-4 w-4" />
              Launch My Store!
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
