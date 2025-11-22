import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * Rate limiter configurations for different endpoint types
 * Uses Upstash Redis for distributed rate limiting
 */

// Initialize Redis client from environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

/**
 * Public endpoints rate limiter
 * 100 requests per minute per IP
 */
export const publicLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: '@ratelimit/public',
})

/**
 * Authentication endpoints rate limiter
 * 10 requests per minute per IP (to prevent brute force)
 */
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: '@ratelimit/auth',
})

/**
 * Payment endpoints rate limiter
 * 5 requests per minute per IP (strict limit for payment operations)
 */
export const paymentLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: '@ratelimit/payment',
})

/**
 * Admin endpoints rate limiter
 * 200 requests per minute per IP (higher limit for admin operations)
 */
export const adminLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(200, '1 m'),
  analytics: true,
  prefix: '@ratelimit/admin',
})
