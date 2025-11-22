'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import LocomotiveScroll from 'locomotive-scroll'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    let locomotiveScroll: LocomotiveScroll | null = null

    if (scrollRef.current) {
      locomotiveScroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        multiplier: 0.8,
        class: 'is-revealed',
        inertia: 0.75,
        touchMultiplier: 2,
        firefoxMultiplier: 50,
        scrollFromAnywhere: true,
        reloadOnContextChange: true,
      })

      locomotiveScrollRef.current = locomotiveScroll
    }

    return () => {
      if (locomotiveScroll) {
        locomotiveScroll.destroy()
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
