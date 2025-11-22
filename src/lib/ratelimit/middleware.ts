import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { errorResponse } from '@/lib/api/response'

/**
 * Extract IP address from request headers
 * @param req - Next.js request object
 * @returns IP address string
 */
function getIpAddress(req: NextRequest): string {
  // Check for forwarded IP (from proxy/load balancer)
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  // Check for real IP header
  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to anonymous
  return 'anonymous'
}

/**
 * Apply rate limiting to a request
 * @param limiter - Ratelimit instance
 * @param req - Next.js request object
 * @returns Rate limit result with success flag
 */
export async function withRateLimit(
  limiter: Ratelimit,
  req: NextRequest
): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
}> {
  const ip = getIpAddress(req)
  const result = await limiter.limit(ip)

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}

/**
 * Create rate limit error response with headers
 * @param limit - Rate limit value
 * @param remaining - Remaining requests
 * @param reset - Reset timestamp
 * @returns NextResponse with rate limit error and headers
 */
export function rateLimitErrorResponse(
  limit: number,
  remaining: number,
  reset: number
): NextResponse {
  const response = errorResponse(
    'RATE_LIMIT_EXCEEDED',
    'Too many requests. Please try again later.',
    429
  )

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', limit.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', reset.toString())
  response.headers.set('Retry-After', Math.ceil((reset - Date.now()) / 1000).toString())

  return response
}
