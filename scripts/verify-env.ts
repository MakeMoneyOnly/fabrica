#!/usr/bin/env tsx
/**
 * Environment Variable Verification Script
 *
 * Verifies all required environment variables are set and valid
 * Run with: npm run verify:env
 */

import { z } from 'zod'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  // eslint-disable-next-line no-console
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message: string) {
  log(`✅ ${message}`, 'green')
}

function logError(message: string) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, 'cyan')
}

// Environment variable schema (same as src/lib/env.ts)
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

  // Resend Email Service
  // Documentation: https://resend.com/docs
  RESEND_API_KEY: z.string().min(1, 'Resend API key is required (format: re_xxxxx)'),

  // Upstash Redis (optional)
  UPSTASH_REDIS_REST_URL: z.string().url('Invalid Upstash Redis URL').optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'Upstash Redis token is required').optional(),

  // Sentry (optional)
  SENTRY_DSN: z.string().url('Invalid Sentry DSN').optional(),

  // App URL (optional)
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL').optional(),
})

// Load environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), '.env.local')
    const envContent = readFileSync(envPath, 'utf-8')
    const envVars: Record<string, string> = {}

    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim()
        }
      }
    })

    return envVars
  } catch {
    logWarning('.env.local file not found - checking process.env only')
    return {}
  }
}

// Main verification function
function verifyEnv() {
  log('\n🔍 Verifying Environment Variables...\n', 'blue')

  // Load from .env.local and merge with process.env
  const envFile = loadEnvFile()
  const env = { ...envFile, ...process.env }

  // Validate schema
  const result = envSchema.safeParse(env)

  if (!result.success) {
    logError('Environment variable validation failed:\n')
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.')
      logError(`  ${path}: ${issue.message}`)
    })
    log('\n💡 Fix the errors above and try again.', 'yellow')
    log('📖 See ENV_SETUP.md for detailed setup instructions.\n', 'cyan')
    process.exit(1)
  }

  const validated = result.data

  // Check required variables
  log('\n📋 Required Variables:', 'blue')
  logSuccess('NEXT_PUBLIC_SUPABASE_URL')
  logSuccess('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  logSuccess('SUPABASE_SERVICE_ROLE_KEY')
  logSuccess('CLERK_SECRET_KEY')
  logSuccess('CLERK_WEBHOOK_SECRET')
  logSuccess('CHAPA_SECRET_KEY')
  logSuccess('CHAPA_WEBHOOK_SECRET')
  logSuccess('RESEND_API_KEY')

  if (validated.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    logSuccess('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY')
  } else {
    logWarning('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (optional but recommended)')
  }

  // Check optional variables
  log('\n📋 Optional Variables:', 'blue')
  if (validated.UPSTASH_REDIS_REST_URL && validated.UPSTASH_REDIS_REST_TOKEN) {
    logSuccess('UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN (Rate limiting enabled)')
  } else {
    logWarning('UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN (Rate limiting disabled)')
  }

  if (validated.SENTRY_DSN) {
    logSuccess('SENTRY_DSN (Error tracking enabled)')
  } else {
    logWarning('SENTRY_DSN (Error tracking disabled)')
  }

  if (validated.NEXT_PUBLIC_APP_URL) {
    logSuccess(`NEXT_PUBLIC_APP_URL: ${validated.NEXT_PUBLIC_APP_URL}`)
  } else {
    logInfo('NEXT_PUBLIC_APP_URL (defaults to localhost:3000)')
  }

  // Summary
  log('\n✨ All required environment variables are configured!\n', 'green')
  log('📝 Next steps:', 'cyan')
  log('  1. Start development server: npm run dev', 'cyan')
  log('  2. Test health endpoint: curl http://localhost:3000/api/health', 'cyan')
  log('  3. Run tests: npm test', 'cyan')
  log('  4. See TESTING_GUIDE.md for detailed testing instructions\n', 'cyan')
}

// Run verification
try {
  verifyEnv()
} catch (error) {
  logError(`\nUnexpected error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
}
