'use client'

import React from 'react'

/**
 * StatsSection
 *
 * Apple-style metrics + narrative section that lives directly under the hero.
 * Copy is tailored to the fabrica creator-commerce platform.
 */
export function StatsSection() {
  return (
    <section className="w-full bg-[#F5F5F7] py-20 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
        {/* Metrics row */}
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              3m+
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
              Ad impressions fabrica manages
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              27+
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
              Creator storefront launches
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              98%
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
              Creator satisfaction rate
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              50k+
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
              Monthly visitors routed via fabrica SEO
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-neutral-200" />

        {/* Narrative row */}
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] items-start">
          {/* Left column – logo + short blurb */}
          <div className="space-y-4 max-w-sm">
            <div className="text-sm font-semibold tracking-tight text-neutral-900">fabrica®</div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Every project we take on is designed for long-term success.
            </p>
          </div>

          {/* Right column – heading + body copy */}
          <div className="space-y-5 max-w-2xl">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-neutral-800">
              Our approach is simple: we focus on functionality, speed, and clarity, ensuring that
              every project serves a clear purpose without unnecessary complexity.
            </h2>
            <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
              We don&apos;t overpromise or use flashy marketing language. We simply build
              well-designed, functional websites and strategies that help businesses succeed.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
