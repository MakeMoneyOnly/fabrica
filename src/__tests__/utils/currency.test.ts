/**
 * Currency utility functions tests
 *
 * Tests for Ethiopian Birr currency utilities using Decimal.js for
 * accurate financial calculations and proper formatting.
 */

import { describe, it, expect } from 'vitest'
import {
  ETB_CURRENCY_CODE,
  ETB_CURRENCY_SYMBOL,
  formatETB,
  parseETB,
  toDecimal,
  calculatePercentage,
  add,
  subtract,
  multiply,
  calculateTelebirrFee,
  calculateNetAmount,
} from '@/lib/utils/currency'

describe('Currency Constants', () => {
  it('should export correct currency code', () => {
    expect(ETB_CURRENCY_CODE).toBe('ETB')
  })

  it('should export correct currency symbol', () => {
    expect(ETB_CURRENCY_SYMBOL).toBe('ETB')
  })
})

describe('formatETB', () => {
  it('should format cents to ETB currency string', () => {
    expect(formatETB(129950)).toBe('ETB 1,299.50')
    expect(formatETB(100)).toBe('ETB 1.00')
    expect(formatETB(50)).toBe('ETB 0.50')
    expect(formatETB(0)).toBe('ETB 0.00')
  })

  it('should format Decimal amounts', () => {
    expect(formatETB(129950)).toBe('ETB 1,299.50')
  })

  it('should handle large amounts with proper comma separation', () => {
    expect(formatETB(100000000)).toBe('ETB 1,000,000.00')
  })
})

describe('parseETB', () => {
  it('should parse formatted currency strings to cents', () => {
    expect(parseETB('1,299.50')).toBe(129950)
    expect(parseETB('1299.50')).toBe(129950)
    expect(parseETB('1.00')).toBe(100)
    expect(parseETB('0.50')).toBe(50)
  })

  it('should handle strings without commas', () => {
    expect(parseETB('1299.50')).toBe(129950)
  })

  it('should handle edge cases', () => {
    expect(parseETB('0')).toBe(0)
    expect(parseETB('0.00')).toBe(0)
  })
})

describe('toDecimal', () => {
  it('should convert minor units to Decimal', () => {
    const result = toDecimal(129950, true)
    expect(result.toNumber()).toBe(129950)
  })

  it('should convert major units to minor units as Decimal', () => {
    const result = toDecimal(1299.5, false)
    expect(result.toNumber()).toBe(129950)
  })

  it('should handle string inputs', () => {
    const result = toDecimal('129950')
    expect(result.toNumber()).toBe(129950)
  })
})

describe('calculatePercentage', () => {
  it('should calculate percentage correctly', () => {
    expect(calculatePercentage(10000, 0.1)).toBe(1000) // 10% of 10000 cents = 1000 cents
    expect(calculatePercentage(20000, 0.05)).toBe(1000) // 5% of 20000 cents = 1000 cents
    expect(calculatePercentage(1000, 0.5)).toBe(500) // 50% of 1000 cents = 500 cents
  })

  it('should round results appropriately', () => {
    expect(calculatePercentage(100, 0.333)).toBe(33) // Should round to nearest integer
  })
})

describe('add', () => {
  it('should add two amounts correctly', () => {
    expect(add(1000, 500)).toBe(1500)
    expect(add(0, 100)).toBe(100)
    expect(add(100, 0)).toBe(100)
  })
})

describe('subtract', () => {
  it('should subtract amounts correctly', () => {
    expect(subtract(1000, 500)).toBe(500)
    expect(subtract(100, 100)).toBe(0)
    expect(subtract(500, 1000)).toBe(-500)
  })
})

describe('multiply', () => {
  it('should multiply amounts correctly', () => {
    expect(multiply(1000, 2)).toBe(2000)
    expect(multiply(100, 1.5)).toBe(150)
    expect(multiply(100, 0)).toBe(0)
  })

  it('should round results appropriately', () => {
    expect(multiply(100, 1.333)).toBe(133) // Should round to nearest integer
  })
})

describe('calculateTelebirrFee', () => {
  it('should calculate Telebirr fee with default percentage', () => {
    expect(calculateTelebirrFee(10000)).toBe(250) // 2.5% of 10000 = 250
  })

  it('should calculate Telebirr fee with custom percentage', () => {
    expect(calculateTelebirrFee(10000, 0.02)).toBe(200) // 2% of 10000 = 200
    expect(calculateTelebirrFee(10000, 0.03)).toBe(300) // 3% of 10000 = 300
  })
})

describe('calculateNetAmount', () => {
  it('should calculate net amount after fees', () => {
    expect(calculateNetAmount(10000, 250)).toBe(9750) // 10000 - 250 = 9750
    expect(calculateNetAmount(5000, 100)).toBe(4900) // 5000 - 100 = 4900
  })

  it('should handle zero fees', () => {
    expect(calculateNetAmount(10000, 0)).toBe(10000)
  })
})

describe('Integration Tests', () => {
  it('should handle a complete transaction flow', () => {
    // User wants to send 1000 ETB
    const amountString = '1000.00'
    const amountInCents = parseETB(amountString) // 100000 cents

    // Calculate Telebirr fee (2.5%)
    const fee = calculateTelebirrFee(amountInCents) // 2500 cents

    // Calculate net amount user receives
    const netAmount = calculateNetAmount(amountInCents, fee) // 97500 cents

    // Format for display
    expect(formatETB(amountInCents)).toBe('ETB 1,000.00')
    expect(formatETB(fee)).toBe('ETB 25.00')
    expect(formatETB(netAmount)).toBe('ETB 975.00')
  })

  it('should handle decimal precision correctly', () => {
    // Test floating point precision issues
    const amount1 = 1000.1
    const amount2 = 2000.2
    const sum = add(parseETB(amount1.toString()), parseETB(amount2.toString()))

    expect(formatETB(sum)).toBe('ETB 3,000.30')
  })
})
