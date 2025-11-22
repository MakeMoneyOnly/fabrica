import { NextResponse } from 'next/server'

/**
 * Standardized API response utilities
 */

/**
 * Create a success response
 * @param data - Response data
 * @param meta - Optional metadata
 * @returns NextResponse with success format
 */
export function successResponse<T>(data: T, meta?: Record<string, unknown>): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    { status: 200 }
  )
}

/**
 * Create an error response
 * @param code - Error code
 * @param message - Error message
 * @param status - HTTP status code (default: 400)
 * @param details - Optional error details
 * @returns NextResponse with error format
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  )
}
