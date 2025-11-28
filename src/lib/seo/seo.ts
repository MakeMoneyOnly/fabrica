/**
 * SEO Utility Functions
 * Generates structured data (JSON-LD) and meta tags for SEO optimization
 */

export interface PersonSchema {
  name: string
  url: string
  image?: string
  description?: string
  sameAs?: string[]
}

export interface ProductSchema {
  name: string
  description?: string
  image?: string
  offers: {
    price: number
    priceCurrency: string
  }
  url: string
}

export interface OrganizationSchema {
  name: string
  url: string
  logo: string
  description: string
  sameAs?: string[]
}

/**
 * Generate JSON-LD for a Person (Creator)
 */
export function generatePersonSchema(data: PersonSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    url: data.url,
    image: data.image,
    description: data.description,
    sameAs: data.sameAs?.filter(Boolean) || [],
  }
}

/**
 * Generate JSON-LD for a Product
 */
export function generateProductSchema(data: ProductSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: data.image,
    url: data.url,
    offers: {
      '@type': 'Offer',
      price: data.offers.price,
      priceCurrency: data.offers.priceCurrency,
      availability: 'https://schema.org/InStock',
    },
  }
}

/**
 * Generate JSON-LD for Organization (Fabrica)
 */
export function generateOrganizationSchema(data: OrganizationSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    sameAs: data.sameAs?.filter(Boolean) || [],
  }
}

/**
 * Generate Open Graph meta tags
 */
export function generateOpenGraphTags(data: {
  title: string
  description: string
  image: string
  url: string
  type?: 'website' | 'profile' | 'article'
}) {
  return {
    title: data.title,
    description: data.description,
    images: [data.image],
    url: data.url,
    type: data.type || 'website',
    siteName: 'Fabrica',
  }
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterCardTags(data: {
  title: string
  description: string
  image: string
  card?: 'summary' | 'summary_large_image'
}) {
  return {
    card: data.card || 'summary_large_image',
    title: data.title,
    description: data.description,
    images: [data.image],
    creator: '@fabrica_et',
  }
}

/**
 * Truncate text to a specific length for meta descriptions
 */
export function truncateDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fabrica.et'
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}
