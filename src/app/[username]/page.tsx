import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CreatorProfile } from '@/components/storefront/CreatorProfile'
import { ProductCard, ProductCardProps } from '@/components/storefront/ProductCard'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ username: string }>
}

// Enable ISR with 60-second revalidation
export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()

  const { data: user } = await supabase
    .from('users')
    .select('full_name, bio, avatar_url')
    .eq('username', username)
    .single()

  if (!user) {
    return { title: 'Store Not Found' }
  }

  const title = `${user.full_name} | Fabrica Store`
  const description = user.bio || `Check out ${user.full_name}'s store on Fabrica.`
  const ogImage = user.avatar_url || '/og-default.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: 'profile',
      url: `https://fabrica.et/${username}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://fabrica.et/${username}`,
    },
  }
}

export default async function StorePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  // 1. Fetch User & Settings
  const { data: user } = await supabase
    .from('users')
    .select('*, storefront_settings(*)')
    .eq('username', username)
    .single()

  if (!user) {
    notFound()
  }

  // 2. Fetch Products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('creator_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const settings = user.storefront_settings?.[0] || {
    theme_name: 'modern',
    primary_color: '#2563eb',
  }

  const primaryColor = settings.primary_color || '#2563eb'

  // Transform products to match ProductCard props
  const productCards: ProductCardProps[] =
    products?.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description || undefined,
      price: Number(product.price) || 0,
      currency: product.currency || 'ETB',
      coverImageUrl: product.cover_image_url || undefined,
      type: product.type as 'digital' | 'booking' | 'link',
      externalUrl: product.external_url || undefined,
      primaryColor,
    })) || []

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: user.full_name,
    url: `https://fabrica.et/${username}`,
    image: user.avatar_url,
    description: user.bio,
    sameAs: [
      user.social_links?.instagram,
      user.social_links?.twitter,
      user.social_links?.linkedin,
      user.social_links?.website,
    ].filter(Boolean),
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        {/* Header / Cover */}
        <div className="relative h-48 md:h-64 bg-gray-50 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundColor: primaryColor }} />
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
        </div>

        {/* Profile Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <CreatorProfile
            fullName={user.full_name}
            username={user.username}
            bio={user.bio || undefined}
            avatarUrl={user.avatar_url || undefined}
            socialLinks={user.social_links || {}}
            primaryColor={primaryColor}
          />

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {productCards.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Empty State */}
          {productCards.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500">No products available yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
          <p>
            Powered by{' '}
            <Link href="/" className="font-semibold hover:text-gray-900">
              Fabrica
            </Link>
          </p>
        </footer>
      </div>
    </>
  )
}
