import { Decimal } from 'decimal.js'

/**
 * Ethiopian Birr currency utilities
 * Always use Decimal for money calculations to avoid floating point errors
 */

// Configure Decimal for financial calculations
Decimal.set({ precision: 10, rounding: 4 })

export const ETB_CURRENCY_CODE = 'ETB'
export const ETB_CURRENCY_SYMBOL = 'ETB'

/**
 * Format Ethiopian Birr amount for display
 * @param amount - Amount in minor units (cents)
 * @returns Formatted string like "ETB 1,299.50"
 */
export function formatETB(amount: number | Decimal): string {
  const decimalAmount = new Decimal(amount).div(100) // Convert from cents to birr
  return `ETB ${decimalAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

/**
 * Parse Ethiopian Birr string to minor units (cents)
 * @param amountString - String like "1,299.50" or "1299.50"
 * @returns Amount in minor units (cents)
 */
export function parseETB(amountString: string): number {
  const cleaned = amountString.replace(/[^\d.]/g, '')
  const decimal = new Decimal(cleaned)
  return decimal.mul(100).toNumber() // Convert to cents
}

/**
 * Convert amount to Decimal for safe calculations
 * @param amount - Amount in minor units or major units
 * @param isMinorUnits - Whether the amount is already in minor units
 * @returns Decimal instance
 */
export function toDecimal(amount: number | string, isMinorUnits = true): Decimal {
  const decimal = new Decimal(amount)
  return isMinorUnits ? decimal : decimal.mul(100)
}

/**
 * Calculate percentage of an amount
 * @param amount - Amount in minor units
 * @param percentage - Percentage (e.g., 0.05 for 5%)
 * @returns Calculated amount in minor units
 */
export function calculatePercentage(amount: number, percentage: number): number {
  return new Decimal(amount).mul(percentage).round().toNumber()
}

/**
 * Add two amounts safely
 * @param a - First amount in minor units
 * @param b - Second amount in minor units
 * @returns Sum in minor units
 */
export function add(a: number, b: number): number {
  return new Decimal(a).add(new Decimal(b)).toNumber()
}

/**
 * Subtract two amounts safely
 * @param a - Amount to subtract from in minor units
 * @param b - Amount to subtract in minor units
 * @returns Difference in minor units
 */
export function subtract(a: number, b: number): number {
  return new Decimal(a).sub(new Decimal(b)).toNumber()
}

/**
 * Multiply amount by a factor safely
 * @param amount - Amount in minor units
 * @param factor - Multiplication factor
 * @returns Result in minor units
 */
export function multiply(amount: number, factor: number): number {
  return new Decimal(amount).mul(new Decimal(factor)).round().toNumber()
}

/**
 * Calculate Telebirr fee (2-3%)
 * @param amount - Amount in minor units
 * @param feePercentage - Fee percentage (default 0.025 for 2.5%)
 * @returns Fee amount in minor units
 */
export function calculateTelebirrFee(amount: number, feePercentage = 0.025): number {
  return calculatePercentage(amount, feePercentage)
}

/**
 * Calculate net amount after fees
 * @param grossAmount - Gross amount in minor units
 * @param feeAmount - Fee amount in minor units
 * @returns Net amount in minor units
 */
export function calculateNetAmount(grossAmount: number, feeAmount: number): number {
  return subtract(grossAmount, feeAmount)
}
