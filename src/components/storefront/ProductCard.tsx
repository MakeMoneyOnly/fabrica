'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Calendar, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ProductType = 'digital' | 'booking' | 'link'

export interface ProductCardProps {
  id: string
  title: string
  description?: string
  price: number
  currency?: string
  coverImageUrl?: string
  type: ProductType
  externalUrl?: string
  primaryColor?: string
  className?: string
}

const productTypeConfig = {
  digital: {
    icon: Download,
    label: 'Digital Product',
    color: 'bg-blue-100 text-blue-700',
  },
  booking: {
    icon: Calendar,
    label: '1-on-1 Booking',
    color: 'bg-purple-100 text-purple-700',
  },
  link: {
    icon: ExternalLink,
    label: 'External Link',
    color: 'bg-green-100 text-green-700',
  },
}

export function ProductCard({
  id,
  title,
  description,
  price,
  currency = 'ETB',
  coverImageUrl,
  type,
  externalUrl,
  primaryColor = '#2563eb',
  className,
}: ProductCardProps) {
  const config = productTypeConfig[type]
  const Icon = config.icon
  const isFree = price === 0
  const href = externalUrl || `#product-${id}`
  const isExternal = type === 'link'

  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn(
        'group block bg-white rounded-2xl border border-gray-100 overflow-hidden',
        'hover:shadow-lg transition-all duration-300 hover:-translate-y-1',
        className
      )}
    >
      {/* Cover Image */}
      {coverImageUrl && (
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Product Type Badge */}
          <div className="absolute top-3 right-3">
            <div
              className={cn(
                'px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1',
                config.color
              )}
            >
              <Icon className="w-3 h-3" />
              <span className="hidden sm:inline">{config.label}</span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>
          {isExternal && <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />}
        </div>

        {description && <p className="text-gray-500 mb-4 line-clamp-2">{description}</p>}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4">
          {/* Price */}
          <div className="flex items-center gap-2">
            {isFree ? (
              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-md">
                Free
              </span>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {price.toLocaleString()} {currency}
              </span>
            )}
          </div>

          {/* CTA Button */}
          <button
            className={cn(
              'px-4 py-2 rounded-lg text-white font-medium text-sm',
              'transition-opacity opacity-0 group-hover:opacity-100'
            )}
            style={{ backgroundColor: primaryColor }}
            onClick={(e) => e.preventDefault()} // Prevent double navigation
          >
            {type === 'link' ? 'Visit Link' : type === 'booking' ? 'Book Now' : 'View Details'}
          </button>
        </div>
      </div>
    </Link>
  )
}
