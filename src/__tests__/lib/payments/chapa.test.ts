/**
 * Chapa Payment SDK Tests
 * Tests for Chapa payment client methods
 */

/// <reference types="vitest" />
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ChapaClient, createChapaClient, getChapaClient } from '@/lib/payments/chapa'
import type { InitiatePaymentParams } from '@/lib/payments/chapa'
import crypto from 'crypto'

// Type for mocked fetch function
type MockedFetch = import('vitest').MockedFunction<typeof fetch>

// Mock Sentry to avoid errors during tests
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  addBreadcrumb: vi.fn(),
}))

// Mock environment variables
vi.mock('@/lib/env', () => ({
  env: {
    CHAPA_SECRET_KEY: 'CHASECK_TEST-test123',
    CHAPA_WEBHOOK_SECRET: 'test-webhook-secret',
  },
}))

describe('ChapaClient', () => {
  let client: ChapaClient
  const mockConfig = {
    secretKey: 'CHASECK_TEST-test123',
  }

  beforeEach(() => {
    client = new ChapaClient(mockConfig)
    vi.clearAllMocks()
    // Reset fetch mock
    global.fetch = vi.fn()
  })

  describe('constructor', () => {
    it('should create ChapaClient instance with config', () => {
      expect(client).toBeInstanceOf(ChapaClient)
    })
  })

  describe('initiatePayment', () => {
    const mockParams: InitiatePaymentParams = {
      orderId: 'order-123',
      amount: 100,
      subject: 'Test Product',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+251912345678',
      returnUrl: 'http://localhost:3000/success',
      notifyUrl: 'http://localhost:3000/api/webhooks/chapa',
    }

    it('should successfully initiate payment', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          checkout_url: 'https://checkout.chapa.co/checkout/test123',
          tx_ref: 'order-123',
        },
      }

      ;(global.fetch as MockedFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await client.initiatePayment(mockParams)

      expect(result.success).toBe(true)
      expect(result.paymentUrl).toBe('https://checkout.chapa.co/checkout/test123')
      expect(result.transactionId).toBe('order-123')
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.chapa.co/v1/transaction/initialize',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer CHASECK_TEST-test123',
            'Content-Type': 'application/json',
          }),
        })
      )
    })

    it('should handle single-word customer names', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          checkout_url: 'https://checkout.chapa.co/checkout/test123',
          tx_ref: 'order-123',
        },
      }

      ;(global.fetch as MockedFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const params = { ...mockParams, customerName: 'John' }
      const result = await client.initiatePayment(params)

      expect(result.success).toBe(true)
      const callArgs = (global.fetch as MockedFetch).mock.calls[0]
      const payload = JSON.parse((callArgs[1] as RequestInit).body as string)
      expect(payload.first_name).toBe('John')
      expect(payload.last_name).toBe('John')
    })

    it('should handle multi-word customer names', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          checkout_url: 'https://checkout.chapa.co/checkout/test123',
          tx_ref: 'order-123',
        },
      }

      ;(global.fetch as MockedFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const params = { ...mockParams, customerName: 'John Michael Doe' }
      const result = await client.initiatePayment(params)

      expect(result.success).toBe(true)
      const callArgs = (global.fetch as MockedFetch).mock.calls[0]
      const payload = JSON.parse((callArgs[1] as RequestInit).body as string)
      expect(payload.first_name).toBe('John')
      expect(payload.last_name).toBe('Michael Doe')
    })

    it('should handle API error responses', async () => {
      const mockResponse = {
        status: 'error',
        message: 'Insufficient funds',
      }

      ;(global.fetch as MockedFetch).mockResolvedValueOnce({
        ok: false,
        json: async () => mockResponse,
      } as Response)

      const result = await client.initiatePayment(mockParams)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Insufficient funds')
    })

    it('should retry on network failures', async () => {
      // First two attempts fail, third succeeds
      ;(global.fetch as MockedFetch)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            status: 'success',
            data: {
              checkout_url: 'https://checkout.chapa.co/checkout/test123',
              tx_ref: 'order-123',
            },
          }),
        } as Response)

      const result = await client.initiatePayment(mockParams)

      expect(result.success).toBe(true)
      expect(global.fetch).toHaveBeenCalledTimes(3)
    })

    it('should return error after max retries', async () => {
      ;(global.fetch as MockedFetch).mockRejectedValue(new Error('Network error'))

      const result = await client.initiatePayment(mockParams)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Network error')
      expect(global.fetch).toHaveBeenCalledTimes(3)
    })

    it('should handle missing checkout_url in response', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          tx_ref: 'order-123',
        },
      }

      ;(global.fetch as MockedFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await client.initiatePayment(mockParams)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('verifyPayment', () => {
    it('should successfully verify payment with success status', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          status: 'success',
          ref_id: 'chapa-ref-123',
          created_at: '2024-01-01T00:00:00Z',
        },
      }

      ;(global.fetch as MockedFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await client.verifyPayment('order-123')

      expect(result.success).toBe(true)
      expect(result.status).toBe('SUCCESS')
      expect(result.transactionId).toBe('chapa-ref-123')
      expect(result.paidAt).toBe('2024-01-01T00:00:00Z')
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.chapa.co/v1/transaction/verify/order-123',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer CHASECK_TEST-test123',
          }),
        })
      )
    })

    it('should map failed status correctly', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          status: 'failed',
          ref_id: 'chapa-ref-123',
        },
      }

      ;(global.fetch as MockedFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await client.verifyPayment('order-123')

      expect(result.success).toBe(true)
      expect(result.status).toBe('FAILED')
    })

    it('should map pending status correctly', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          status: 'pending',
          ref_id: 'chapa-ref-123',
        },
      }

      ;(global.fetch as MockedFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await client.verifyPayment('order-123')

      expect(result.success).toBe(true)
      expect(result.status).toBe('PENDING')
    })

    it('should handle verification errors', async () => {
      const mockResponse = {
        status: 'error',
        message: 'Transaction not found',
      }

      ;(global.fetch as MockedFetch).mockResolvedValueOnce({
        ok: false,
        json: async () => mockResponse,
      } as Response)

      const result = await client.verifyPayment('order-123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Transaction not found')
    })

    it('should handle network errors', async () => {
      ;(global.fetch as MockedFetch).mockRejectedValue(new Error('Network error'))

      const result = await client.verifyPayment('order-123')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Network error')
    })
  })

  describe('queryPayment', () => {
    it('should call verifyPayment', async () => {
      const mockResponse = {
        status: 'success',
        data: {
          status: 'success',
          ref_id: 'chapa-ref-123',
        },
      }

      ;(global.fetch as MockedFetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await client.queryPayment('order-123')

      expect(result.success).toBe(true)
      expect(result.status).toBe('SUCCESS')
    })
  })

  describe('verifyWebhookSignature', () => {
    it('should verify valid webhook signature', () => {
      const payload = JSON.stringify({ trx_ref: 'order-123', status: 'success' })
      const webhookSecret = 'test-webhook-secret'

      // Generate expected signature
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex')

      // Mock environment variable
      process.env.CHAPA_WEBHOOK_SECRET = webhookSecret

      const isValid = client.verifyWebhookSignature(payload, expectedSignature)

      expect(isValid).toBe(true)
    })

    it('should reject invalid webhook signature', () => {
      const payload = JSON.stringify({ trx_ref: 'order-123', status: 'success' })
      const invalidSignature = 'invalid-signature'

      process.env.CHAPA_WEBHOOK_SECRET = 'test-webhook-secret'

      const isValid = client.verifyWebhookSignature(payload, invalidSignature)

      expect(isValid).toBe(false)
    })

    it('should handle case-insensitive signature comparison', () => {
      const payload = JSON.stringify({ trx_ref: 'order-123', status: 'success' })
      const webhookSecret = 'test-webhook-secret'

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex')
        .toUpperCase() // Uppercase signature

      process.env.CHAPA_WEBHOOK_SECRET = webhookSecret

      const isValid = client.verifyWebhookSignature(payload, expectedSignature)

      expect(isValid).toBe(true)
    })

    it('should return false if webhook secret is not configured', () => {
      delete process.env.CHAPA_WEBHOOK_SECRET

      const isValid = client.verifyWebhookSignature('payload', 'signature')

      expect(isValid).toBe(false)
    })
  })
})

describe('createChapaClient', () => {
  it('should create client with environment variables', () => {
    const client = createChapaClient()
    expect(client).toBeInstanceOf(ChapaClient)
  })
})

describe('getChapaClient', () => {
  it('should return singleton instance', () => {
    const client1 = getChapaClient()
    const client2 = getChapaClient()

    expect(client1).toBe(client2)
  })
})
