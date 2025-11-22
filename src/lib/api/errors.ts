/**
 * Custom API error classes for standardized error handling
 */

/**
 * Base API error class
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'ApiError'
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed') {
    super('VALIDATION_ERROR', message, 400)
    this.name = 'ValidationError'
  }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', message, 401)
    this.name = 'UnauthorizedError'
  }
}

/**
 * Forbidden error (403)
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', message, 403)
    this.name = 'ForbiddenError'
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super('NOT_FOUND', message, 404)
    this.name = 'NotFoundError'
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super('RATE_LIMIT_EXCEEDED', message, 429)
    this.name = 'RateLimitError'
  }
}

/**
 * Internal server error (500)
 */
export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal server error') {
    super('INTERNAL_SERVER_ERROR', message, 500)
    this.name = 'InternalServerError'
  }
}

/**
 * Bad gateway error (502)
 */
export class BadGatewayError extends ApiError {
  constructor(message: string = 'Bad gateway') {
    super('BAD_GATEWAY', message, 502)
    this.name = 'BadGatewayError'
  }
}
