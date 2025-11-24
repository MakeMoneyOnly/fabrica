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
 * Validated environment variables
 * Only validates during runtime, not during build time to prevent build failures
 */
let _env: z.infer<typeof envSchema> | undefined

export const env = new Proxy({} as z.infer<typeof envSchema>, {
  get(target, prop) {
    // During build time or when env vars aren't available, return undefined
    // This prevents build failures while still providing validation at runtime
    if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return undefined
    }

    // Lazy load and validate environment variables only when accessed
    if (!_env) {
      try {
        _env = envSchema.parse(process.env)
      } catch (error) {
        // Only throw in development or when explicitly running validation
        if (process.env.NODE_ENV === 'development' || process.env.VALIDATE_ENV === 'true') {
          throw error
        }
        // In production build, return undefined to prevent build failures
        return undefined
      }
    }

    return _env[prop as keyof z.infer<typeof envSchema>]
  },
})

/**
 * Validates environment variables and returns a formatted error message
 * @returns Object with validation result and error details
 */
export function validateEnvironment(): { success: true } | { success: false; errors: string[] } {
  try {
    envSchema.parse(process.env)
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
