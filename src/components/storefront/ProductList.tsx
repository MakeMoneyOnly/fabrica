'use client'

import { useState } from 'react'
import { ProductCard, ProductCardProps } from './ProductCard'
import { cn } from '@/lib/utils'
import { Grid, List, SlidersHorizontal } from 'lucide-react'

export type LayoutType = 'grid' | 'list'
export type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular'

export interface ProductListProps {
  products: ProductCardProps[]
  primaryColor?: string
  defaultLayout?: LayoutType
  showControls?: boolean
  className?: string
}

export function ProductList({
  products,
  primaryColor = '#2563eb',
  defaultLayout = 'grid',
  showControls = true,
  className,
}: ProductListProps) {
  const [layout, setLayout] = useState<LayoutType>(defaultLayout)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterType, setFilterType] = useState<string>('all')

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (filterType === 'all') return true
    return product.type === filterType
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'popular':
        // TODO: Implement popularity sorting based on sales/views
        return 0
      case 'newest':
      default:
        return 0 // Assuming products are already sorted by creation date
    }
  })

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-500">No products available yet.</p>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Controls */}
      {showControls && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Filter & Sort */}
          <div className="flex items-center gap-3">
            {/* Filter by type */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Products</option>
                <option value="digital">Digital</option>
                <option value="booking">Bookings</option>
                <option value="link">Links</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLayout('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                layout === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              )}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                layout === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              )}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      <div
        className={cn(
          'gap-6',
          layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'
        )}
      >
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            primaryColor={primaryColor}
            className={layout === 'list' ? 'flex-row' : ''}
          />
        ))}
      </div>

      {/* Results count */}
      {showControls && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {sortedProducts.length} of {products.length} products
        </div>
      )}
    </div>
  )
}
