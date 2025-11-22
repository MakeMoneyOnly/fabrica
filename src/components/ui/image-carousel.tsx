'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface ImageCard {
  id: string
  src: string
  alt: string
  rotation: number
}

interface ImageCarouselProps {
  images: ImageCard[]
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [rotatingCards, setRotatingCards] = useState<number[]>([])

  // Continuous rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingCards((prev) => prev.map((_, i) => (prev[i] + 0.5) % 360))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Initialize rotating cards
  useEffect(() => {
    setRotatingCards(images.map((_, i) => i * (360 / images.length)))
  }, [images])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center perspective bg-transparent py-24">
      {/* Carousel positioned at vertical center */}
      <div
        className="relative w-full max-w-6xl h-[500px] flex items-center justify-center z-0 mb-16"
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 flex items-center justify-center perspective">
          {images.map((image, index) => {
            const angle = (rotatingCards[index] || 0) * (Math.PI / 180)
            const radius = 220
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius

            // 3D perspective effect based on mouse position
            const perspectiveX = (mousePosition.x - 0.5) * 20
            const perspectiveY = (mousePosition.y - 0.5) * 20

            return (
              <div
                key={image.id}
                className="absolute w-32 h-40 sm:w-40 sm:h-48 transition-all duration-300"
                style={{
                  transform: `
                    translate(${x}px, ${y}px)
                    rotateX(${perspectiveY}deg)
                    rotateY(${perspectiveX}deg)
                    rotateZ(${image.rotation}deg)
                  `,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  className={cn(
                    'relative w-full h-full rounded-2xl overflow-hidden shadow-2xl',
                    'transition-all duration-300 hover:shadow-3xl hover:scale-110',
                    'cursor-pointer group bg-white'
                  )}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <Image
                    src={image.src || '/placeholder.svg'}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    priority={index < 3}
                  />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ImageCarousel
