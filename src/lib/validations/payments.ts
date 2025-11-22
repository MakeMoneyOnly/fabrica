import { z } from 'zod'
import { uuidSchema, emailSchema, ethiopianPhoneSchema } from './schemas'

/**
 * Payment initiation schema
 */
export const initiatePaymentSchema = z.object({
  productId: uuidSchema,
  customerEmail: emailSchema,
  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  customerPhone: ethiopianPhoneSchema,
})

/**
 * Payment ID schema
 */
export const paymentIdSchema = uuidSchema
