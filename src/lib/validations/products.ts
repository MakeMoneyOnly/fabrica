import { z } from 'zod'
import { uuidSchema, etbAmountSchema } from './schemas'

/**
 * Product type enum
 */
export const productTypeSchema = z.enum(['digital', 'booking', 'external_link'])

/**
 * Product creation schema
 */
export const createProductSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must be at most 100 characters'),
    description: z.string().max(5000, 'Description must be at most 5000 characters').optional(),
    type: productTypeSchema,
    price: etbAmountSchema,
    // Digital product specific
    file_url: z.string().url('Invalid file URL').optional(),
    // Booking product specific
    calendar_id: z.string().optional(),
    // External link specific
    external_url: z.string().url('Invalid external URL').optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'digital' && !data.file_url) {
        return false
      }
      if (data.type === 'booking' && !data.calendar_id) {
        return false
      }
      if (data.type === 'external_link' && !data.external_url) {
        return false
      }
      return true
    },
    {
      message: 'Product type-specific fields are required',
    }
  )

/**
 * Product update schema (all fields optional except type validation)
 */
export const updateProductSchema = createProductSchema.partial().extend({
  type: productTypeSchema.optional(),
})

/**
 * Product ID schema
 */
export const productIdSchema = uuidSchema
