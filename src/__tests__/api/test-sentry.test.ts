/**
 * Test Sentry API Route Tests
 * Tests for the /api/test-sentry endpoint
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/test-sentry/route'
import * as Sentry from '@sentry/nextjs'

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}))

describe('GET /api/test-sentry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should capture error in Sentry', async () => {
    const response = await GET()
    const data = await response.json()

    // Verify error was captured
    expect(Sentry.captureException).toHaveBeenCalled()

    // Verify response structure
    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBeDefined()
    expect(data.error.code).toBe('TEST_ERROR')
    expect(data.meta).toBeDefined()
    expect(data.meta.note).toContain('Sentry dashboard')
  })

  it('should return proper error response format', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data).toHaveProperty('success')
    expect(data).toHaveProperty('error')
    expect(data).toHaveProperty('meta')
    expect(data.error).toHaveProperty('code')
    expect(data.error).toHaveProperty('message')
    expect(data.meta).toHaveProperty('timestamp')
  })
})
