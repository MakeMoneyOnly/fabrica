/**
 * Phone Utility Tests
 * Tests for Ethiopian phone number validation and formatting
 */

import { describe, it, expect } from 'vitest'
import { validateEthiopianPhone, formatEthiopianPhone } from '@/lib/utils/phone'

describe('Phone Validation', () => {
  describe('validateEthiopianPhone', () => {
    it('should validate phone numbers with country code', () => {
      expect(validateEthiopianPhone('+251912345678')).toBe(true)
      expect(validateEthiopianPhone('+251911234567')).toBe(true)
    })

    it('should validate phone numbers with leading zero', () => {
      expect(validateEthiopianPhone('0912345678')).toBe(true)
      expect(validateEthiopianPhone('0911234567')).toBe(true)
    })

    it('should validate phone numbers without prefix', () => {
      expect(validateEthiopianPhone('912345678')).toBe(true)
      expect(validateEthiopianPhone('911234567')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validateEthiopianPhone('123456789')).toBe(false)
      expect(validateEthiopianPhone('+1234567890')).toBe(false)
      expect(validateEthiopianPhone('invalid')).toBe(false)
      expect(validateEthiopianPhone('')).toBe(false)
    })

    it('should reject phone numbers with wrong country code', () => {
      expect(validateEthiopianPhone('+1234567890')).toBe(false)
      expect(validateEthiopianPhone('+441234567890')).toBe(false)
    })
  })

  describe('formatEthiopianPhone', () => {
    it('should format phone numbers correctly', () => {
      expect(formatEthiopianPhone('912345678')).toBe('+251 91 234 5678')
      expect(formatEthiopianPhone('0912345678')).toBe('+251 91 234 5678')
      expect(formatEthiopianPhone('+251912345678')).toBe('+251 91 234 5678')
    })

    it('should handle different phone number formats', () => {
      expect(formatEthiopianPhone('911234567')).toBe('+251 91 123 4567')
      expect(formatEthiopianPhone('092345678')).toBe('+251 92 345 678')
      // Test with +251 prefix
      const result = formatEthiopianPhone('+25192345678')
      expect(result).toContain('+251')
      expect(result).toContain('92')
    })
  })
})
