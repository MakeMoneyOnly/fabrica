import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

/**
 * Test API route for Sentry error tracking
 * Visit /api/test-sentry to trigger a test error
 * This route is for testing purposes only
 */
export const dynamic = 'force-dynamic'

class TestSentryError extends Error {
  constructor(message: string | undefined) {
    super(message)
    this.name = 'TestSentryError'
  }
}

/**
 * A test API route to verify Sentry's error monitoring
 * This route throws an error that should be captured by Sentry
 */
export async function GET() {
  try {
    // Throw a test error to verify Sentry is capturing errors
    throw new TestSentryError(
      'Test Sentry error - This is a test error to verify Sentry integration'
    )
  } catch (error) {
    // Explicitly capture the error in Sentry
    Sentry.captureException(error)

    // Return a proper error response
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEST_ERROR',
          message: 'This is a test error for Sentry verification',
        },
        meta: {
          timestamp: new Date().toISOString(),
          note: 'Check your Sentry dashboard - this error should appear there',
        },
      },
      { status: 500 }
    )
  }
}
