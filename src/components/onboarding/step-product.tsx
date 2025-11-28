'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { quickProductSchema, type QuickProductFormData } from '@/lib/validations/onboarding'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, ArrowLeft, FileText, Calendar, Link as LinkIcon } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const productTypes = [
  {
    value: 'digital' as const,
    label: 'Digital Product',
    description: 'eBooks, courses, templates, etc.',
    icon: FileText,
  },
  {
    value: 'booking' as const,
    label: '1-on-1 Booking',
    description: 'Consultations, coaching sessions',
    icon: Calendar,
  },
  {
    value: 'link' as const,
    label: 'External Link',
    description: 'Link to external content',
    icon: LinkIcon,
  },
]

export default function StepProduct() {
  const { user } = useUser()
  const { productData, updateProductData, nextStep, prevStep } = useOnboardingStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuickProductFormData>({
    resolver: zodResolver(quickProductSchema),
    defaultValues: {
      type: productData.type || 'digital',
      title: productData.title || '',
      description: productData.description || '',
      price: productData.price ? parseFloat(productData.price) : undefined,
      coverImageUrl: '',
    },
  })

  const selectedType = watch('type')

  const onSubmit = async (data: QuickProductFormData) => {
    if (!user) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create product in Supabase
      const supabase = await createClient()

      // First, get the user's ID from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_user_id', user.id)
        .single()

      if (userError || !userData) {
        console.error('Error fetching user:', userError)
        alert('Failed to create product. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Create the product
      const { error: productError } = await supabase.from('products').insert({
        creator_id: userData.id,
        type: data.type,
        title: data.title,
        description: data.description,
        price: data.price || 0,
        currency: 'ETB',
        cover_image_url: data.coverImageUrl,
        is_active: true,
      })

      if (productError) {
        console.error('Error creating product:', productError)
        alert('Failed to create product. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Save to store and proceed
      updateProductData({
        type: data.type,
        title: data.title,
        description: data.description || '',
        price: data.price?.toString() || '',
      })
      nextStep()
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create your first product</h2>
        <p className="mt-2 text-gray-600">Start selling by adding your first product or service</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Product Type *</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {productTypes.map((type) => {
              const Icon = type.icon
              const isSelected = selectedType === type.value

              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setValue('type', type.value)}
                  className={cn(
                    'relative rounded-lg border-2 p-4 text-left transition-all hover:border-gray-400',
                    isSelected ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'
                  )}
                >
                  <div className="flex items-start">
                    <Icon
                      className={cn(
                        'h-6 w-6 flex-shrink-0',
                        isSelected ? 'text-gray-900' : 'text-gray-400'
                      )}
                    />
                    <div className="ml-3">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          isSelected ? 'text-gray-900' : 'text-gray-700'
                        )}
                      >
                        {type.label}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{type.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
        </div>

        {/* Product Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Product Title *
          </label>
          <Input
            id="title"
            type="text"
            {...register('title')}
            placeholder="e.g. Social Media Marketing Guide"
            className="mt-1"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {/* Product Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Describe what customers will get..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price *
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register('price')}
              className="rounded-r-none"
              placeholder="0.00"
            />
            <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
              ETB
            </span>
          </div>
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>

        {/* Info Box */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="text-sm font-medium text-gray-900">💡 Quick Start Tip</h4>
          <p className="mt-1 text-sm text-gray-600">
            Don't worry about making it perfect! You can always edit your product details, add
            images, and customize everything later from your dashboard.
          </p>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <button
            type="button"
            onClick={nextStep}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Skip for now (you can add products later)
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={prevStep}
            variant="outline"
            disabled={isSubmitting}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
