import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from './errors'
import { errorResponse } from './response'

/**
 * Handle API errors and convert them to standardized responses
 * @param error - Error object
 * @returns NextResponse with error details
 */
export function handleApiError(error: unknown): NextResponse {
  // Log error for debugging
  console.error('API Error:', error)

  // Capture error in Sentry if available (server-side only)
  if (typeof window === 'undefined' && process.env.SENTRY_DSN) {
    try {
      // Import Sentry synchronously - it's already installed and configured
      const Sentry = require('@sentry/nextjs')
      Sentry.captureException(error)
    } catch (sentryError) {
      // Sentry not available or failed to capture, continue without it
      console.warn('Failed to capture error in Sentry:', sentryError)
    }
  }

  // If it's already an ApiError, use its properties
  if (error instanceof ApiError) {
    return errorResponse(error.code, error.message, error.statusCode)
  }

  // If it's a standard Error, return as internal server error
  if (error instanceof Error) {
    // In production, don't expose internal error messages
    const message =
      process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message
    return errorResponse('INTERNAL_SERVER_ERROR', message, 500)
  }

  // Unknown error type
  return errorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred', 500)
}

/**
 * Higher-order function to wrap API route handlers with error handling
 * @param handler - API route handler function
 * @returns Wrapped handler with error handling
 */
export function withErrorHandling<T extends (req: NextRequest) => Promise<NextResponse>>(
  handler: T
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
