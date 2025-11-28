'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'
import { DataTable } from '@/components/dashboard/DataTable'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  LayoutGrid,
  List as ListIcon,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function ProductsPage() {
  const { userId, isLoaded } = useAuth()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      if (!isLoaded || !userId) return

      try {
        const supabase = createClient()

        // Get user UUID from Clerk ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_user_id', userId)
          .single()

        if (!user) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [isLoaded, userId])

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    {
      header: 'Product',
      className: 'w-[40%]',
      cell: (item: any) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
            {item.cover_image_url ? (
              <img
                src={item.cover_image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-500 capitalize">{item.type}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Price',
      accessorKey: 'price',
      className: 'font-medium text-gray-900',
      cell: (item: any) => (
        <span>{item.price > 0 ? `${item.price.toLocaleString()} ${item.currency}` : 'Free'}</span>
      ),
    },
    {
      header: 'Sales',
      accessorKey: 'sales_count',
      cell: (item: any) => <div className="text-gray-600">{item.sales_count || 0} sales</div>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item: any) => (
        <StatusBadge
          status={item.status}
          type={
            item.status === 'active' ? 'success' : item.status === 'draft' ? 'neutral' : 'error'
          }
        />
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: () => (
        <div className="flex justify-end gap-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <Link href="/dashboard/products/new">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
              <Plus className="w-4 h-4 mr-2" />
              New Product
            </button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
            <p className="text-gray-500 mb-6">Create your first product to get started.</p>
            <Link href="/dashboard/products/new">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Product
              </button>
            </Link>
          </div>
        ) : viewMode === 'list' ? (
          <DataTable columns={columns} data={filteredProducts} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
              >
                <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {product.cover_image_url ? (
                    <img
                      src={product.cover_image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-300" />
                  )}
                  <div className="absolute top-3 right-3">
                    <StatusBadge
                      status={product.status}
                      type={
                        product.status === 'active'
                          ? 'success'
                          : product.status === 'draft'
                            ? 'neutral'
                            : 'error'
                      }
                      className="bg-white/90 backdrop-blur-sm shadow-sm"
                    />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-medium text-blue-600 mb-1 capitalize">
                        {product.type}
                      </p>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{product.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <span className="font-bold text-gray-900">
                      {product.price > 0
                        ? `${product.price.toLocaleString()} ${product.currency}`
                        : 'Free'}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
