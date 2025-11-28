'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import {
  ChevronLeft,
  Upload,
  Type,
  DollarSign,
  FileText,
  Link as LinkIcon,
  Video,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NewProductPage() {
  const router = useRouter()
  const { userId } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'digital',
    cover_image_url: '',
    currency: 'ETB',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      toast.error('You must be logged in to create products')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price) || 0,
          currency: formData.currency,
          type: formData.type,
          cover_image_url: formData.cover_image_url,
        }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to create product')
      }

      toast.success('Product created successfully')
      router.push('/dashboard/products')
    } catch (error: any) {
      console.error('Error creating product:', error)
      toast.error(error?.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products"
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
          <p className="text-gray-500">Add a new item to your store.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product Type */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'digital', label: 'Digital Product', icon: FileText },
            { id: 'booking', label: 'Booking', icon: Video },
            { id: 'link', label: 'External Link', icon: LinkIcon },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setFormData({ ...formData, type: type.id })}
              className={`p-4 rounded-xl border text-left transition-all ${
                formData.type === type.id
                  ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <type.icon
                className={`w-6 h-6 mb-3 ${
                  formData.type === type.id ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              <div
                className={`font-medium ${
                  formData.type === type.id ? 'text-blue-900' : 'text-gray-900'
                }`}
              >
                {type.label}
              </div>
            </button>
          ))}
        </div>

        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Product Title</label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Ultimate Guide to Coffee"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your product..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price (ETB)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cover Image URL</label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm shadow-blue-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
