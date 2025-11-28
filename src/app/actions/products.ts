'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: {
  title: string
  description: string
  price: number
  currency: string
  type: string
  cover_image_url: string
}) {
  const { userId } = await auth()

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .insert({
        creator_id: userId,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        currency: formData.currency,
        type: formData.type,
        cover_image_url: formData.cover_image_url,
        status: 'active',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return { error: error.message }
    }

    revalidatePath('/dashboard/products')
    return { data, error: null }
  } catch (error: any) {
    console.error('Server action error:', error)
    return { error: error.message || 'Failed to create product' }
  }
}
