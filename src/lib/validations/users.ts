import { z } from 'zod'
import { ethiopianPhoneSchema } from './schemas'

/**
 * User profile update schema
 */
export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters')
    .optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  phone: ethiopianPhoneSchema.optional(),
  social_links: z
    .object({
      twitter: z.string().url().optional(),
      instagram: z.string().url().optional(),
      tiktok: z.string().url().optional(),
      facebook: z.string().url().optional(),
    })
    .optional(),
})

/**
 * Username validation schema
 * Alphanumeric characters and hyphens, 3-30 characters
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be at most 30 characters')
  .regex(/^[a-z0-9-]+$/, 'Username can only contain lowercase letters, numbers, and hyphens')
  .refine((val) => !val.startsWith('-') && !val.endsWith('-'), {
    message: 'Username cannot start or end with a hyphen',
  })
