import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  Mail,
  ExternalLink,
  Check,
} from 'lucide-react'

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: user } = await supabase
    .from('users')
    .select('full_name, bio')
    .eq('username', username)
    .single()

  if (!user) return { title: 'Store Not Found' }

  return {
    title: `${user.full_name} | Fabrica Store`,
    description: user.bio || `Check out ${user.full_name}'s store on Fabrica.`,
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

  const primaryColor = settings.primary_color
  const theme = settings.theme_name

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Cover */}
      <div className="relative h-48 md:h-64 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundColor: primaryColor }} />
        <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden mb-4">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={user.full_name}
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {user.full_name?.charAt(0) || user.username.charAt(0)}
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.full_name}</h1>
          {user.bio && <p className="text-gray-600 max-w-lg mb-6 text-lg">{user.bio}</p>}

          {/* Social Links */}
          <div className="flex items-center gap-4 mb-10">
            {user.social_links?.instagram && (
              <a
                href={user.social_links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-600 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
            )}
            {user.social_links?.twitter && (
              <a
                href={user.social_links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            )}
            {user.social_links?.linkedin && (
              <a
                href={user.social_links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {user.social_links?.website && (
              <a
                href={user.social_links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <Globe className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {products?.map((product) => (
            <Link
              key={product.id}
              href={product.external_url || '#'}
              target={product.type === 'link' ? '_blank' : undefined}
              className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {product.cover_image_url && (
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <Image
                    src={product.cover_image_url}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  {product.type === 'link' && <ExternalLink className="w-5 h-5 text-gray-400" />}
                </div>

                {product.description && (
                  <p className="text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                )}

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    {product.price > 0 ? (
                      <span className="text-lg font-bold text-gray-900">
                        {product.price.toLocaleString()} {product.currency}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        Free
                      </span>
                    )}
                  </div>

                  <button
                    className="px-4 py-2 rounded-lg text-white font-medium text-sm transition-opacity opacity-0 group-hover:opacity-100"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {product.type === 'link' ? 'Visit Link' : 'View Details'}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {(!products || products.length === 0) && (
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
  )
}
