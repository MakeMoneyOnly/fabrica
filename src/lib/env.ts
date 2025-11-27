import { z } from 'zod'

/**
 * Environment variable validation schema
 * Validates all environment variables used in the application
 */
const envSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),

  // Clerk Configuration
  CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
  CLERK_WEBHOOK_SECRET: z.string().min(1, 'CLERK_WEBHOOK_SECRET is required'),

  // Chapa Payment Configuration
  CHAPA_SECRET_KEY: z.string().min(1, 'CHAPA_SECRET_KEY is required'),
  CHAPA_WEBHOOK_SECRET: z.string().min(1, 'CHAPA_WEBHOOK_SECRET is required'),

  // Resend Email Configuration
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),

  // Redis Rate Limiting (optional for development)
  UPSTASH_REDIS_REST_URL: z.string().url('UPSTASH_REDIS_REST_URL must be a valid URL').optional(),
  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(1, 'UPSTASH_REDIS_REST_TOKEN is required when Redis is enabled')
    .optional(),

  // Error Tracking (optional for development)
  SENTRY_DSN: z.string().url('SENTRY_DSN must be a valid URL').optional(),

  // Application URL (optional - defaults to localhost:3000 in development)
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL').optional(),
})

/**
 * Explicitly map process.env to an object to ensure Next.js inlines values at build time
 */
const processEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
  CHAPA_SECRET_KEY: process.env.CHAPA_SECRET_KEY,
  CHAPA_WEBHOOK_SECRET: process.env.CHAPA_WEBHOOK_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  SENTRY_DSN: process.env.SENTRY_DSN,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
}

/**
 * Validated environment variables
 */
let _env: z.infer<typeof envSchema> | undefined

export const env = new Proxy({} as z.infer<typeof envSchema>, {
  get(target, prop) {
    // Lazy load and validate environment variables only when accessed
    if (!_env) {
      // On the client, we can only validate public variables
      // We skip server-side validation to prevent errors when accessing public vars
      const isServer = typeof window === 'undefined'

      try {
        if (isServer) {
          _env = envSchema.parse(processEnv)
        } else {
          // On client, we only care about NEXT_PUBLIC_ variables
          // We create a partial schema that allows missing server keys
          const clientSchema = envSchema
            .pick({
              NEXT_PUBLIC_SUPABASE_URL: true,
              NEXT_PUBLIC_SUPABASE_ANON_KEY: true,
              NEXT_PUBLIC_APP_URL: true,
            })
            .catchall(z.any()) // Allow other keys to pass through if present

          _env = clientSchema.parse(processEnv) as z.infer<typeof envSchema>
        }
      } catch (error) {
        // Only throw in development or when explicitly running validation
        if (process.env.NODE_ENV === 'development' || process.env.VALIDATE_ENV === 'true') {
          throw error
        }
        // In production build, return undefined/partial to prevent build failures
        // Log error to console for debugging
        console.error('Environment validation failed:', error)
        return undefined
      }
    }

    return _env?.[prop as keyof z.infer<typeof envSchema>]
  },
})

/**
 * Validates environment variables and returns a formatted error message
 * @returns Object with validation result and error details
 */
export function validateEnvironment(): { success: true } | { success: false; errors: string[] } {
  try {
    envSchema.parse(processEnv)
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError
      const errors: string[] = zodError.issues.map((err: z.ZodIssue) => {
        const field = err.path.join('.')
        return `${field}: ${err.message}`
      })
      return { success: false, errors }
    }
    return { success: false, errors: ['Unknown validation error'] }
  }
}
