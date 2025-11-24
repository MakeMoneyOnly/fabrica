/**
 * Sentry edge runtime configuration
 * Handles errors and performance monitoring in edge features (middleware, edge routes, etc.)
 * Note: This config is unrelated to the Vercel Edge Runtime and is also required when running locally.
 * https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from '@sentry/nextjs'
import { env } from '@/lib/env'

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in production, 100% in dev

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
})
