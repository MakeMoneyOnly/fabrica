import { z } from 'zod'

/**
 * Username validation schema
 * - 3-20 characters
 * - Alphanumeric and underscores only
 * - Must start with a letter
 * - Cannot end with underscore
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(
    /^[a-z][a-z0-9_]*$/,
    'Username must start with a letter and contain only lowercase letters, numbers, and underscores'
  )
  .regex(/[^_]$/, 'Username cannot end with an underscore')
  .refine((val) => !val.includes('__'), 'Username cannot contain consecutive underscores')

/**
 * Profile setup validation schema
 */
export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Full name can only contain letters, spaces, hyphens, and apostrophes'
    ),

  bio: z.string().max(500, 'Bio must be at most 500 characters').optional().or(z.literal('')),

  avatarUrl: z.string().url('Invalid avatar URL').optional().or(z.literal('')),

  socialLinks: z
    .object({
      instagram: z
        .string()
        .url('Invalid Instagram URL')
        .regex(/instagram\.com/, 'Must be an Instagram URL')
        .optional()
        .or(z.literal('')),

      tiktok: z
        .string()
        .url('Invalid TikTok URL')
        .regex(/tiktok\.com/, 'Must be a TikTok URL')
        .optional()
        .or(z.literal('')),

      facebook: z
        .string()
        .url('Invalid Facebook URL')
        .regex(/facebook\.com/, 'Must be a Facebook URL')
        .optional()
        .or(z.literal('')),

      twitter: z
        .string()
        .url('Invalid Twitter/X URL')
        .regex(/(twitter\.com|x\.com)/, 'Must be a Twitter/X URL')
        .optional()
        .or(z.literal('')),
    })
    .optional(),
})

/**
 * Payment account validation schema
 */
export const paymentAccountSchema = z.object({
  telebirrAccount: z
    .string()
    .regex(/^(09|07)\d{8}$/, 'Invalid Ethiopian phone number format (e.g., 0911234567)')
    .optional()
    .or(z.literal('')),

  accountHolderName: z
    .string()
    .min(2, 'Account holder name must be at least 2 characters')
    .max(100, 'Account holder name must be at most 100 characters')
    .optional()
    .or(z.literal('')),
})

/**
 * Quick product creation validation schema (simplified for onboarding)
 */
export const quickProductSchema = z.object({
  type: z.enum(['digital', 'booking', 'link']),

  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),

  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional()
    .or(z.literal('')),

  price: z
    .number()
    .min(10, 'Price must be at least 10 ETB')
    .max(100000, 'Price must be at most 100,000 ETB')
    .optional(),

  coverImageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
})

/**
 * Complete onboarding data schema
 */
export const onboardingDataSchema = z.object({
  username: usernameSchema,
  profile: profileSchema,
  paymentAccount: paymentAccountSchema.optional(),
  product: quickProductSchema.optional(),
})

// Type exports
export type UsernameFormData = z.infer<typeof usernameSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type PaymentAccountFormData = z.infer<typeof paymentAccountSchema>
export type QuickProductFormData = z.infer<typeof quickProductSchema>
export type OnboardingData = z.infer<typeof onboardingDataSchema>
