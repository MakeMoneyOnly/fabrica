'use client'

import { LiquidButton } from '@/components/ui/liquid-glass-button'

export function HeroSection() {
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
          <LiquidButton className="text-white font-medium" size="lg">
            Build Your Store
          </LiquidButton>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
