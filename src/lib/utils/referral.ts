import crypto from 'crypto'

/**
 * Generate a unique referral code for a user
 * Format: 6-8 uppercase alphanumeric characters
 * Example: ABC123XY
 */
export function generateReferralCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const length = 8
  let code = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length)
    code += characters[randomIndex]
  }

  return code
}

/**
 * Generate a unique username from an email address
 * Removes special characters and adds random suffix if needed
 */
export async function generateUniqueUsername(
  email: string,
  checkAvailability: (username: string) => Promise<boolean>
): Promise<string> {
  // Extract base username from email
  const baseUsername = email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15)

  // Try base username first
  if (await checkAvailability(baseUsername)) {
    return baseUsername
  }

  // If taken, try with random suffix
  for (let i = 0; i < 10; i++) {
    const suffix = crypto.randomInt(100, 9999)
    const username = `${baseUsername}${suffix}`

    if (await checkAvailability(username)) {
      return username
    }
  }

  // Fallback: use timestamp
  return `${baseUsername}${Date.now().toString().slice(-6)}`
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  return /^[A-Z0-9]{6,8}$/.test(code)
}

/**
 * Generate a shareable referral link
 */
export function generateReferralLink(referralCode: string, baseUrl?: string): string {
  const url = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://fabrica.et'
  return `${url}?ref=${referralCode}`
}
