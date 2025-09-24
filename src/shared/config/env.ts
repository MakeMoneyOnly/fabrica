// Environment Variable Validation and Configuration
import { z } from 'zod';

// Environment schema validation
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']),

  // Next.js
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production', 'test']),

  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url('Invalid API URL'),
  API_TIMEOUT: z.string().transform(Number).pipe(z.number().min(1000).max(60000)),

  // Authentication
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url('Invalid NextAuth URL'),

  // Database (if using direct connection)
  DATABASE_URL: z.string().url('Invalid database URL').optional(),

  // External Service URLs
  TELEBIRR_API_URL: z.string().url('Invalid TeleBirr API URL').optional(),
  CBE_API_URL: z.string().url('Invalid CBE API URL').optional(),

  // Security
  ENCRYPTION_KEY: z.string().length(32, 'Encryption key must be exactly 32 characters'),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform(val => val === 'true'),
  NEXT_PUBLIC_ENABLE_PAYMENTS: z.string().transform(val => val === 'true'),
  ENABLE_DEBUG_LOGGING: z.string().transform(val => val === 'true'),

  // Email Configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // SMS Configuration
  SMS_API_KEY: z.string().optional(),
  SMS_API_SECRET: z.string().optional(),

  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).pipe(z.number().min(1024).max(104857600)).optional(), // 1KB to 100MB
  ALLOWED_FILE_TYPES: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_REQUESTS: z.string().transform(Number).pipe(z.number().min(1).max(1000)).optional(),
  RATE_LIMIT_WINDOW: z.string().transform(Number).pipe(z.number().min(60).max(3600)).optional(), // 1 minute to 1 hour

  // Monitoring
  SENTRY_DSN: z.string().url('Invalid Sentry DSN').optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional(),
});

// Validate environment variables
let validatedEnv: z.infer<typeof envSchema>;

try {
  validatedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');
    error.errors.forEach((err) => {
      console.error(`  ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

// Export validated environment
export const env = validatedEnv!;

// Environment utilities
export const envUtils = {
  // Check if running in production
  isProduction: () => env.NODE_ENV === 'production',

  // Check if running in development
  isDevelopment: () => env.NODE_ENV === 'development',

  // Check if running in test
  isTest: () => env.NODE_ENV === 'test',

  // Get current environment name
  getEnvironment: () => env.NODE_ENV,

  // Check if feature is enabled
  isFeatureEnabled: (feature: keyof typeof env) => {
    const value = env[feature];
    return typeof value === 'boolean' ? value : false;
  },

  // Get API base URL
  getApiUrl: () => env.NEXT_PUBLIC_API_URL,

  // Get timeout configuration
  getApiTimeout: () => env.API_TIMEOUT,

  // Security utilities
  getEncryptionKey: () => env.ENCRYPTION_KEY,
  getJwtSecret: () => env.JWT_SECRET,

  // External service URLs (with fallbacks)
  getTelebirrUrl: () => env.TELEBIRR_API_URL || 'https://api.telebirr.et',
  getCbeUrl: () => env.CBE_API_URL || 'https://api.cbe.et',

  // Logging configuration
  getLogLevel: () => env.LOG_LEVEL || 'info',

  // File upload configuration
  getMaxFileSize: () => env.MAX_FILE_SIZE || 5242880, // 5MB default
  getAllowedFileTypes: () => env.ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'application/pdf'],

  // Rate limiting configuration
  getRateLimitRequests: () => env.RATE_LIMIT_REQUESTS || 100,
  getRateLimitWindow: () => env.RATE_LIMIT_WINDOW || 900, // 15 minutes

  // Validate critical environment variables
  validateCritical: () => {
    const criticalVars = [
      'NEXT_PUBLIC_API_URL',
      'NEXTAUTH_SECRET',
      'ENCRYPTION_KEY',
      'JWT_SECRET',
    ];

    const missing = criticalVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
      throw new Error(`Missing critical environment variables: ${missing.join(', ')}`);
    }
  },
};

// Validate critical variables on module load
envUtils.validateCritical();

export default env;
