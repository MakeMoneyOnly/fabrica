/**
 * Ethiopian phone number validation and formatting utilities
 */

/**
 * Validate Ethiopian phone number
 * Supports formats: +251912345678, 0912345678, 912345678
 * @param phone - Phone number string
 * @returns true if valid, false otherwise
 */
export function validateEthiopianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '')
  return /^(\+251|0)?9\d{8}$/.test(cleaned)
}

/**
 * Format Ethiopian phone number to standard format: +251 XX XXX XXXX
 * @param phone - Phone number in any format
 * @returns Formatted phone number string
 */
export function formatEthiopianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  // If starts with 251 (country code without +)
  if (cleaned.startsWith('251') && cleaned.length === 12) {
    return `+251 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }

  // If already in +251 format
  if (phone.startsWith('+251')) {
    const digits = cleaned.slice(3) // Remove 251
    if (digits.length === 9) {
      return `+251 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`
    }
  }

  // If starts with 09 (local format with 0) - handle both 9 and 10 digit cases
  if (cleaned.startsWith('09')) {
    if (cleaned.length === 10) {
      // Full format: 0912345678
      return `+251 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    } else if (cleaned.length === 9) {
      // Missing last digit: 092345678 -> treat as 092345678X (assume missing digit)
      // Format as if it had 10 digits
      return `+251 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    }
  }

  // If starts with 9 (local format without 0)
  if (cleaned.startsWith('9') && cleaned.length === 9) {
    return `+251 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`
  }

  // Return original if can't format
  return phone
}
