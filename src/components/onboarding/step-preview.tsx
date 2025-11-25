'use client'

import { useState } from 'react'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { ArrowLeft, Rocket, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function StepPreview() {
  const { userData, productData, prevStep } = useOnboardingStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { user } = useUser()

  const handleLaunch = async () => {
    if (!user) {
      return
    }
    setIsSubmitting(true)

    try {
      // 1. Update User Profile
      const { error: userError } = await supabase
        .from('users')
        .update({
          username: userData.username,
          full_name: userData.fullName,
          bio: userData.bio,
          // In a real app, we'd upload the avatar to storage first
          // avatar_url: userData.avatarUrl
        })
        .eq('clerk_user_id', user.id)

      if (userError) {
        throw userError
      }

      // 2. Create First Product
      // First get the user's UUID from our DB
      const { data: dbUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_user_id', user.id)
        .single()

      if (fetchError || !dbUser) {
        throw fetchError || new Error('User not found')
      }

      const { error: productError } = await supabase.from('products').insert({
        creator_id: dbUser.id,
        title: productData.title,
        description: productData.description || 'Welcome to my first product!',
        price: parseFloat(productData.price) || 0,
        type: productData.type,
        status: 'active',
      })

      if (productError) {
        throw productError
      }

      // Success! Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to launch store:', error)
      // Handle error (show toast etc)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <Rocket className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Ready to launch?</h2>
        <p className="mt-2 text-gray-600">Review your details before going live.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Store Profile</h3>
              <p className="text-sm text-gray-500">fabrica.et/{userData.username}</p>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-lg font-medium text-gray-900">First Product</h3>
            <div className="mt-2 flex items-center gap-4">
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📦</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{productData.title}</p>
                <p className="text-sm text-gray-500">{productData.price} ETB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </button>
        <button
          onClick={handleLaunch}
          disabled={isSubmitting}
          className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Launch Store <Rocket className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
