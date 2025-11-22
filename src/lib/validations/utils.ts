import { z } from 'zod'
import { NextResponse } from 'next/server'

/**
 * Validate request body against a Zod schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with success flag and data/error
 */
export function validateRequest<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, error: result.error }
  }
}

/**
 * Create a standardized validation error response
 * @param error - Zod validation error
 * @returns NextResponse with validation error details
 */
export function validationErrorResponse(error: z.ZodError): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: error.flatten().fieldErrors,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status: 400 }
  )
}
