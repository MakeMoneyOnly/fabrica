'use client'

import { LiquidButton } from '@/components/ui/liquid-glass-button'
import { isClerkConfigured } from '@/lib/utils/clerk'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

/**
 * Dynamically import Clerk components to avoid HMR issues when ClerkProvider is not present
 * This ensures Clerk components are only loaded when Clerk is configured
 */
const ClerkAuthButton = dynamic(
  () =>
    Promise.all([
      import('@clerk/nextjs'),
      import('next/navigation'),
      import('@/components/ui/liquid-glass-button'),
      import('react'),
    ]).then(([clerkMod, routerMod, buttonMod, reactMod]) => {
      const { SignUpButton, SignedIn, SignedOut, useUser } = clerkMod
      const { useRouter } = routerMod
      const { LiquidButton } = buttonMod
      const { useEffect } = reactMod

      /**
       * Button component for authenticated users - redirects to onboarding
       */
      function AuthenticatedButton() {
        const router = useRouter()

        const handleClick = () => {
          router.push('/onboarding')
        }

        return (
          <LiquidButton className="text-white font-medium" size="lg" onClick={handleClick}>
            Build Your Store
          </LiquidButton>
        )
      }

      /**
       * Button component for unauthenticated users - shows auth modal
       */
      function UnauthenticatedButton() {
        return (
          <SignUpButton mode="modal" fallbackRedirectUrl="/onboarding">
            <LiquidButton className="text-white font-medium" size="lg">
              Build Your Store
            </LiquidButton>
          </SignUpButton>
        )
      }

      return function ClerkAuthWrapper() {
        const { isSignedIn, isLoaded } = useUser()
        const router = useRouter()

        useEffect(() => {
          if (isLoaded && isSignedIn) {
            router.replace('/onboarding')
          }
        }, [isLoaded, isSignedIn, router])

        return (
          <>
            <SignedIn>
              <AuthenticatedButton />
            </SignedIn>
            <SignedOut>
              <UnauthenticatedButton />
            </SignedOut>
          </>
        )
      }
    }),
  {
    ssr: false, // Disable SSR to avoid issues when ClerkProvider is not present
    loading: () => (
      <LiquidButton className="text-white font-medium" size="lg" disabled>
        Build Your Store
      </LiquidButton>
    ),
  }
)

export function HeroSection() {
  // Check if Clerk is properly configured (same validation as layout.tsx)
  const clerkConfigured = isClerkConfigured()

  return (
    <section className="relative w-full min-h-screen bg-transparent" data-scroll-section>
      {/* Video Container - Exact spacing like reference */}
      <div
        className="relative"
        style={{
          marginTop: '60px', // Reduced space for smaller header
          marginLeft: '4px', // Very small side spacing
          marginRight: '4px', // Very small side spacing
          marginBottom: '4px', // Very small bottom spacing
          width: 'calc(100% - 8px)', // Full width minus left and right margins
          height: 'calc(100vh - 68px)', // Full height minus margins
        }}
      >
        <div
          className="relative w-full h-full overflow-hidden bg-black/90"
          style={{ borderRadius: '24px' }}
        >
          {/* Video element */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          >
            <source
              src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
            {/* Fallback image if video doesn't load */}
          </video>

          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        </div>
      </div>

      {/* Title and Subtitle Overlay - Centered */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-20 px-4"
        style={{
          top: '60px', // Account for smaller header
          left: '4px',
          right: '4px',
          bottom: '4px',
        }}
      >
        <h1
          className="font-serif text-[64px] leading-tight tracking-tight text-white text-center mb-4"
          data-scroll
          data-scroll-speed="0.5"
        >
          <span className="italic">I Create;</span> therefore I have a store
        </h1>
        <p
          className="text-[16px] text-gray-200 text-center mb-8 max-w-2xl"
          data-scroll
          data-scroll-speed="0.3"
        >
          Monetize your audience with your own storefront in Ethiopia. Build, sell, and scale your
          digital products effortlessly.
        </p>
        <div className="pointer-events-auto" data-scroll data-scroll-speed="0.2">
          {clerkConfigured ? (
            // Clerk is configured - dynamically load Clerk components to avoid HMR issues
            <Suspense
              fallback={
                <LiquidButton className="text-white font-medium" size="lg" disabled>
                  Build Your Store
                </LiquidButton>
              }
            >
              <ClerkAuthButton />
            </Suspense>
          ) : (
            // Clerk not configured - show disabled button
            <LiquidButton
              className="text-white font-medium opacity-50 cursor-not-allowed"
              size="lg"
              disabled
              title="Authentication not configured. Please set up Clerk to enable this feature."
            >
              Build Your Store
            </LiquidButton>
          )}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
