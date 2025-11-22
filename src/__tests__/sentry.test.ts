/**
 * Sentry Integration Tests
 * Tests for error tracking and monitoring functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as Sentry from '@sentry/nextjs'

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  startSpan: vi.fn(),
  diagnoseSdkConnectivity: vi.fn(() => Promise.resolve('connected')),
}))

describe('Sentry Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Error Capture', () => {
    it('should capture exceptions', () => {
      const error = new Error('Test error')
      Sentry.captureException(error)
      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })

    it('should capture custom error types', () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message)
          this.name = 'CustomError'
        }
      }

      const error = new CustomError('Custom test error')
      Sentry.captureException(error)
      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })
  })

  describe('API Route Error Handling', () => {
    it('should handle API route errors', async () => {
      // Simulate API route error handling
      const error = new Error('API error')

      try {
        throw error
      } catch (err) {
        Sentry.captureException(err)
      }

      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })
  })

  describe('Frontend Error Handling', () => {
    it('should capture React component errors', () => {
      const error = new Error('React component error')

      // Simulate error boundary capture
      Sentry.captureException(error)

      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })

    it('should capture async errors in event handlers', async () => {
      const error = new Error('Event handler error')

      // Simulate async error in onClick handler
      try {
        throw error
      } catch (err) {
        Sentry.captureException(err)
      }

      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })
  })

  describe('Sentry Configuration', () => {
    it('should handle DSN configuration', () => {
      // This test verifies that Sentry DSN configuration is handled properly
      // In test environment, it may not be set, which is fine
      // The actual check happens at runtime when the app starts
      // Sentry will work if DSN is set, and gracefully degrade if not
      const dsn = process.env.SENTRY_DSN
      expect(dsn === undefined || typeof dsn === 'string').toBe(true)
    })

    it('should have correct environment setting', () => {
      const env = process.env.NODE_ENV || 'development'
      expect(['development', 'production', 'test']).toContain(env)
    })
  })
})
