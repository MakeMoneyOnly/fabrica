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

  // Chapa Payment Integration
  // Documentation: https://developer.chapa.co/
  CHAPA_SECRET_KEY: z
    .string()
    .min(1, 'Chapa secret key is required (format: CHASECK-xxxxx or CHASECK_TEST-xxxxx)'),
  CHAPA_WEBHOOK_SECRET: z.string().min(1, 'Chapa webhook secret is required'),

  // Upstash Redis (optional for development)
  UPSTASH_REDIS_REST_URL: z.string().url('Invalid Upstash Redis URL').optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'Upstash Redis token is required').optional(),

  // Sentry (optional for development)
  SENTRY_DSN: z.string().url('Invalid Sentry DSN').optional(),

  // App URL (optional, defaults to localhost)
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL').optional(),
})

/**
 * Preprocess environment variables
 * Converts empty strings to undefined for optional variables
 */
function preprocessEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const processed = { ...env }

  // Convert empty strings to undefined for optional variables
  const optionalVars = [
    'NEXT_PUBLIC_APP_URL',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
    'SENTRY_DSN',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  ]

  for (const key of optionalVars) {
    if (processed[key] === '' || processed[key]?.trim() === '') {
      delete processed[key]
    }
  }

  return processed
}

/**
 * Parse and validate environment variables
 * Throws clear error if validation fails
 */
function validateEnv() {
  try {
    const processedEnv = preprocessEnv(process.env)
    return envSchema.parse(processedEnv)
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
 * Check if we're in build mode (Next.js build process)
 * During build, we skip strict validation to allow builds without all runtime env vars
 */
function isBuildTime(): boolean {
  // Next.js sets NEXT_PHASE during build phases
  if (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-export' ||
    process.env.NEXT_PHASE === 'phase-development-build'
  ) {
    return true
  }

  // During CI builds, we're always in build mode
  // This allows Next.js to build without requiring all runtime env vars
  if (process.env.CI === 'true') {
    return true
  }

  // During Next.js build, NEXT_RUNTIME is not set
  // This is a reliable indicator we're in build phase (not runtime)
  if (process.env.NEXT_RUNTIME === undefined && process.env.NODE_ENV === 'production') {
    // Additional check: if we're running in Node but not in a runtime context,
    // we're likely in build phase
    return typeof process !== 'undefined' && !!process.versions?.node
  }

  return false
}

/**
 * Lazy validation cache
 */
let validatedEnv: z.infer<typeof envSchema> | null = null

/**
 * Create build-time safe environment object
 * Returns dummy values for required vars during build to prevent validation errors
 */
function createBuildTimeEnv(): z.infer<typeof envSchema> {
  const processedEnv = preprocessEnv(process.env)

  // During build, create a minimal valid object with dummy values
  // This allows the build to complete, but validation will happen at runtime
  return {
    NEXT_PUBLIC_SUPABASE_URL: processedEnv.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: processedEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key',
    SUPABASE_SERVICE_ROLE_KEY: processedEnv.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-key',
    CLERK_SECRET_KEY: processedEnv.CLERK_SECRET_KEY || 'sk_test_dummy',
    CLERK_WEBHOOK_SECRET: processedEnv.CLERK_WEBHOOK_SECRET || 'whsec_dummy',
    CHAPA_SECRET_KEY: processedEnv.CHAPA_SECRET_KEY || 'CHASECK_TEST-dummy',
    CHAPA_WEBHOOK_SECRET: processedEnv.CHAPA_WEBHOOK_SECRET || 'dummy-webhook-secret',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: processedEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    UPSTASH_REDIS_REST_URL: processedEnv.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: processedEnv.UPSTASH_REDIS_REST_TOKEN,
    SENTRY_DSN: processedEnv.SENTRY_DSN,
    NEXT_PUBLIC_APP_URL: processedEnv.NEXT_PUBLIC_APP_URL,
  } as z.infer<typeof envSchema>
}

/**
 * Validated environment variables
 * Use this instead of process.env for type safety
 *
 * During build time, validation is skipped to allow builds without all runtime env vars.
 * Validation will happen on first access at runtime.
 */
function getEnv(): z.infer<typeof envSchema> {
  // During build, return dummy values without validation
  // This prevents validation errors during Next.js build phase
  if (isBuildTime()) {
    if (validatedEnv === null) {
      validatedEnv = createBuildTimeEnv()
    }
    return validatedEnv
  }

  // At runtime, validate strictly
  if (validatedEnv === null) {
    validatedEnv = validateEnv()
  }

  return validatedEnv
}

/**
 * Export validated environment variables
 * Validation is lazy - only happens when first accessed
 */
export const env = new Proxy({} as z.infer<typeof envSchema>, {
  get(_target, prop: string | symbol) {
    const envObj = getEnv()
    return envObj[prop as keyof typeof envObj]
  },
  ownKeys() {
    return Object.keys(getEnv())
  },
  getOwnPropertyDescriptor(_target, prop) {
    const envObj = getEnv()
    return {
      enumerable: true,
      configurable: true,
      value: envObj[prop as keyof typeof envObj],
    }
  },
})
