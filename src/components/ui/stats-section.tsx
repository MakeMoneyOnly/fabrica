'use client'

import React from 'react'
import { useStats } from '@/hooks/useAnalytics'

/**
 * StatsSection
 *
 * Apple-style metrics + narrative section that lives directly under the hero.
 * Copy is tailored to the fabrica creator-commerce platform.
 */
export function StatsSection() {
  const { data: stats, isLoading, isError } = useStats()

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}m+`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}k+`
    }
    return num.toString()
  }

  return (
    <section className="w-full bg-[#F5F5F7] py-20 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
        {/* Metrics row */}
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              {isLoading ? '...' : isError ? '0' : formatNumber(stats?.totalProducts || 0)}
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
              Products created on fabrica
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              {isLoading ? '...' : isError ? '0' : formatNumber(stats?.totalOrders || 0)}
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">Orders completed</p>
          </div>

          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              {isLoading ? '...' : isError ? '0' : formatNumber(stats?.activeCreators || 0)}
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">Active creators</p>
          </div>

          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900">
              {isLoading
                ? '...'
                : isError
                  ? 'ETB 0'
                  : `ETB ${formatNumber(Math.round(stats?.totalRevenue || 0))}`}
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
              Total revenue generated
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
              Empowering Ethiopian creators to monetize their digital products and services.
            </p>
          </div>

          {/* Right column – heading + body copy */}
          <div className="space-y-5 max-w-2xl">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-neutral-800">
              A platform built for Ethiopian creators, by Ethiopian creators. Simple, fast, and
              designed to help you succeed.
            </h2>
            <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
              Whether you&apos;re selling digital products, booking consultations, or sharing
              external links, fabrica provides the tools you need to build and grow your creator
              business.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
