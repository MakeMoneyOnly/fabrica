import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = 'https://fabrica.et'

  // Fetch all active creators
  const { data: users } = await supabase
    .from('users')
    .select('username, updated_at')
    .not('username', 'is', null)

  // Fetch all active products
  const { data: products } = await supabase
    .from('products')
    .select('id, creator_id, updated_at')
    .eq('status', 'active')

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  // Creator storefronts
  const creatorPages: MetadataRoute.Sitemap =
    users?.map((user) => ({
      url: `${baseUrl}/${user.username}`,
      lastModified: new Date(user.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })) || []

  return [...staticPages, ...creatorPages]
}

// Revalidate sitemap every hour
export const revalidate = 3600
