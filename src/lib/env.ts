import { z } from 'zod'

/**
 * Environment variable validation schema
 * Validates all required and optional environment variables on app startup
 */
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),

  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, 'Clerk publishable key is required')
    .optional(),
  CLERK_SECRET_KEY: z.string().min(1, 'Clerk secret key is required'),
  CLERK_WEBHOOK_SECRET: z.string().min(1, 'Clerk webhook secret is required'),

  // Telebirr
  TELEBIRR_APP_ID: z.string().min(1, 'Telebirr app ID is required'),
  TELEBIRR_APP_KEY: z.string().min(1, 'Telebirr app key is required'),
  TELEBIRR_MERCHANT_CODE: z.string().min(1, 'Telebirr merchant code is required'),
  TELEBIRR_WEBHOOK_SECRET: z.string().min(1, 'Telebirr webhook secret is required'),
  TELEBIRR_API_URL: z.string().url('Invalid Telebirr API URL'),

  // Upstash Redis (optional for development)
  UPSTASH_REDIS_REST_URL: z.string().url('Invalid Upstash Redis URL').optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'Upstash Redis token is required').optional(),

  // Sentry (optional for development)
  SENTRY_DSN: z.string().url('Invalid Sentry DSN').optional(),

  // App URL (optional, defaults to localhost)
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL').optional(),
})

/**
 * Parse and validate environment variables
 * Throws clear error if validation fails
 */
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n')
      throw new Error(`Environment variable validation failed:\n${missingVars}`)
    }
    throw error
  }
}

/**
 * Validated environment variables
 * Use this instead of process.env for type safety
 */
export const env = validateEnv()
