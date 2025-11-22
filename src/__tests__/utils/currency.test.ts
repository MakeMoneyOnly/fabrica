/**
 * Currency Utility Tests
 * Tests for ETB currency formatting functions
 */

import { describe, it, expect } from 'vitest'
import { formatETB } from '@/lib/utils/currency'

describe('Currency Formatting', () => {
  describe('formatETB', () => {
    it('should format whole numbers correctly', () => {
      expect(formatETB(1000)).toBe('ETB 1,000.00')
      expect(formatETB(100)).toBe('ETB 100.00')
      expect(formatETB(0)).toBe('ETB 0.00')
    })

    it('should format decimal numbers correctly', () => {
      expect(formatETB(299.99)).toBe('ETB 299.99')
      expect(formatETB(0.5)).toBe('ETB 0.50')
      expect(formatETB(1234.56)).toBe('ETB 1,234.56')
    })

    it('should handle large numbers with commas', () => {
      expect(formatETB(1000000)).toBe('ETB 1,000,000.00')
      expect(formatETB(1234567.89)).toBe('ETB 1,234,567.89')
    })

    it('should handle small decimal values', () => {
      expect(formatETB(0.01)).toBe('ETB 0.01')
      expect(formatETB(0.1)).toBe('ETB 0.10')
    })

    it('should handle negative numbers', () => {
      expect(formatETB(-100)).toBe('ETB -100.00')
      expect(formatETB(-1234.56)).toBe('ETB -1,234.56')
    })

    it('should round to 2 decimal places', () => {
      expect(formatETB(100.999)).toBe('ETB 101.00')
      expect(formatETB(100.994)).toBe('ETB 100.99')
    })
  })
})
