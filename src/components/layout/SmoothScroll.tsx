'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import type LocomotiveScroll from 'locomotive-scroll'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Dynamically import LocomotiveScroll only on client side
    if (scrollRef.current && typeof window !== 'undefined') {
      import('locomotive-scroll').then((LocomotiveScrollModule) => {
        const LocomotiveScroll = LocomotiveScrollModule.default
        // Valid locomotive-scroll v4 options only (inertia is not supported in v4)
        const locomotiveScroll = new LocomotiveScroll({
          el: scrollRef.current!,
          smooth: true,
          multiplier: 0.8,
          class: 'is-revealed',
          touchMultiplier: 2,
          firefoxMultiplier: 50,
          scrollFromAnywhere: true,
          reloadOnContextChange: true,
        })

        locomotiveScrollRef.current = locomotiveScroll
      })
    }

    return () => {
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy()
        locomotiveScrollRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (locomotiveScrollRef.current) {
      locomotiveScrollRef.current.update()
    }
  }, [pathname])

  return (
    <div data-scroll-container ref={scrollRef} className="w-full">
      {children}
    </div>
  )
}
