import { z } from 'zod'
import { uuidSchema, etbAmountSchema } from './schemas'

/**
 * Order refund schema
 */
export const refundOrderSchema = z.object({
  orderId: uuidSchema,
  reason: z
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be at most 500 characters'),
  amount: etbAmountSchema.optional(), // Optional, defaults to full refund if not provided
})

/**
 * Order ID schema
 */
export const orderIdSchema = uuidSchema
