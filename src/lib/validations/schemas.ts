import { z } from 'zod'
import { validateEthiopianPhone } from '@/lib/utils/phone'

/**
 * Shared validation schemas used across the application
 */

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid('Invalid UUID format')

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address').min(1)

/**
 * Non-empty string schema
 */
export const nonEmptyStringSchema = z.string().min(1, 'String cannot be empty')

/**
 * ETB amount schema - positive number for Ethiopian Birr amounts
 */
export const etbAmountSchema = z
  .number()
  .positive('Amount must be positive')
  .or(
    z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/)
      .transform(Number)
  )
  .pipe(z.number().positive('Amount must be positive'))

/**
 * Ethiopian phone number validation
 * Supports formats: +251912345678, 0912345678, 912345678
 */
export const ethiopianPhoneSchema = z.string().refine((phone) => validateEthiopianPhone(phone), {
  message: 'Phone number must be a valid Ethiopian mobile number (9 digits starting with 9)',
})
