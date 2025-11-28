/**
 * Social Media Utility Functions
 * Validates social media URLs and generates share links
 */

/**
 * Validate and normalize social media URLs
 */
export function validateSocialUrl(platform: string, url: string): string | null {
  if (!url) return null

  const patterns: Record<string, RegExp> = {
    instagram: /^https?:\/\/(www\.)?instagram\.com\/[\w.]+\/?$/,
    twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[\w]+\/?$/,
    tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@[\w.]+\/?$/,
    facebook: /^https?:\/\/(www\.)?facebook\.com\/[\w.]+\/?$/,
    linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
    website: /^https?:\/\/.+/,
  }

  const pattern = patterns[platform]
  if (!pattern) return null

  return pattern.test(url) ? url : null
}

/**
 * Extract username from social media URL
 */
export function extractUsername(platform: string, url: string): string | null {
  if (!url) return null

  const patterns: Record<string, RegExp> = {
    instagram: /instagram\.com\/([\w.]+)/,
    twitter: /(?:twitter\.com|x\.com)\/([\w]+)/,
    tiktok: /tiktok\.com\/@([\w.]+)/,
    facebook: /facebook\.com\/([\w.]+)/,
    linkedin: /linkedin\.com\/in\/([\w-]+)/,
  }

  const pattern = patterns[platform]
  if (!pattern) return null

  const match = url.match(pattern)
  return match ? match[1] : null
}

/**
 * Generate share URL for different platforms
 */
export function generateShareUrl(
  platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'telegram',
  data: {
    url: string
    title?: string
    description?: string
  }
): string {
  const encodedUrl = encodeURIComponent(data.url)
  const encodedTitle = data.title ? encodeURIComponent(data.title) : ''
  const encodedDescription = data.description ? encodeURIComponent(data.description) : ''

  const shareUrls: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  }

  return shareUrls[platform] || ''
}

/**
 * Check if Web Share API is supported
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator
}

/**
 * Share using native Web Share API
 */
export async function nativeShare(data: {
  title: string
  text?: string
  url: string
}): Promise<boolean> {
  if (!isWebShareSupported()) {
    return false
  }

  try {
    await navigator.share(data)
    return true
  } catch (error) {
    // User cancelled or error occurred
    return false
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (err) {
      document.body.removeChild(textArea)
      return false
    }
  }
}
