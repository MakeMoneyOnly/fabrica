/**
 * Chapa Webhook Handler Tests
 * Tests for the /api/webhooks/chapa endpoint
 */

/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/webhooks/chapa/route'
import { getChapaClient } from '@/lib/payments/chapa'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest } from 'next/server'
import crypto from 'crypto'

// Mock dependencies
vi.mock('@/lib/payments/chapa', () => ({
  getChapaClient: vi.fn(),
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}))

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  addBreadcrumb: vi.fn(),
}))

describe('POST /api/webhooks/chapa', () => {
  const mockChapaClient = {
    verifyWebhookSignature: vi.fn(),
  }

  const mockSupabase = {
    from: vi.fn(),
    rpc: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.CHAPA_WEBHOOK_SECRET = 'test-webhook-secret'
    vi.mocked(getChapaClient).mockReturnValue(
      mockChapaClient as unknown as ReturnType<typeof getChapaClient>
    )
    vi.mocked(createAdminClient).mockReturnValue(
      mockSupabase as unknown as ReturnType<typeof createAdminClient>
    )
  })

  describe('Signature Verification', () => {
    it('should return 401 if signature header is missing', async () => {
      const payload = JSON.stringify({ trx_ref: 'order-123', status: 'success' })

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {},
        body: payload,
      })

      const response = await POST(req)
      expect(response.status).toBe(401)

      const responseData = await response.json()
      expect(responseData.error.message).toContain('Missing webhook signature')
    })

    it('should accept Chapa-Signature header', async () => {
      const payload = JSON.stringify({ trx_ref: 'order-123', status: 'success' })
      const signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      mockChapaClient.verifyWebhookSignature.mockReturnValue(true)

      const mockOrder = {
        id: 'order-123',
        payment_status: 'pending',
        amount: 100,
      }

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      })

      mockSupabase.rpc.mockResolvedValue({ error: null })

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {
          'Chapa-Signature': signature,
        },
        body: payload,
      })

      const response = await POST(req)
      expect(response.status).toBe(200)
      expect(mockChapaClient.verifyWebhookSignature).toHaveBeenCalledWith(payload, signature)
    })

    it('should accept x-chapa-signature header', async () => {
      const payload = JSON.stringify({ trx_ref: 'order-123', status: 'success' })
      const signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      mockChapaClient.verifyWebhookSignature.mockReturnValue(true)

      const mockOrder = {
        id: 'order-123',
        payment_status: 'pending',
        amount: 100,
      }

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      })

      mockSupabase.rpc.mockResolvedValue({ error: null })

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {
          'x-chapa-signature': signature,
        },
        body: payload,
      })

      const response = await POST(req)
      expect(response.status).toBe(200)
      expect(mockChapaClient.verifyWebhookSignature).toHaveBeenCalledWith(payload, signature)
    })

    it('should return 401 if signature verification fails', async () => {
      const payload = JSON.stringify({ trx_ref: 'order-123', status: 'success' })

      mockChapaClient.verifyWebhookSignature.mockReturnValue(false)

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {
          'Chapa-Signature': 'invalid-signature',
        },
        body: payload,
      })

      const response = await POST(req)
      expect(response.status).toBe(401)

      const responseData = await response.json()
      expect(responseData.error.message).toContain('Invalid webhook signature')
    })
  })

  describe('Payment Success Event', () => {
    const mockOrder = {
      id: 'order-123',
      payment_status: 'pending',
      amount: 100,
      customer_email: 'customer@example.com',
    }

    beforeEach(() => {
      const payload = JSON.stringify({
        trx_ref: 'order-123',
        ref_id: 'chapa-ref-123',
        status: 'success',
      })
      // Signature is prepared for test setup but not used directly in beforeEach
      const _signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      mockChapaClient.verifyWebhookSignature.mockReturnValue(true)

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      })

      mockSupabase.rpc.mockResolvedValue({ error: null })
    })

    it('should process successful payment', async () => {
      const payload = JSON.stringify({
        trx_ref: 'order-123',
        ref_id: 'chapa-ref-123',
        status: 'success',
      })
      const signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {
          'Chapa-Signature': signature,
        },
        body: payload,
      })

      const response = await POST(req)
      expect(response.status).toBe(200)

      const responseData = await response.json()
      expect(responseData.success).toBe(true)
      expect(responseData.data.message).toBe('Payment processed successfully')

      expect(mockSupabase.rpc).toHaveBeenCalledWith('process_payment', {
        p_order_id: 'order-123',
        p_payment_provider_id: 'chapa-ref-123',
        p_amount: 100,
      })
    })

    it('should handle successful status with "successful" value', async () => {
      const payload = JSON.stringify({
        trx_ref: 'order-123',
        ref_id: 'chapa-ref-123',
        status: 'successful',
      })
      const signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {
          'Chapa-Signature': signature,
        },
        body: payload,
      })

      const response = await POST(req)
      expect(response.status).toBe(200)

      expect(mockSupabase.rpc).toHaveBeenCalled()
    })

    it('should handle idempotency - return success if already processed', async () => {
      const completedOrder = {
        ...mockOrder,
        payment_status: 'completed',
      }

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: completedOrder, error: null }),
          }),
        }),
      })

      const payload = JSON.stringify({
        trx_ref: 'order-123',
        ref_id: 'chapa-ref-123',
        status: 'success',
      })
      const signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {
          'Chapa-Signature': signature,
        },
        body: payload,
      })

      const response = await POST(req)
      expect(response.status).toBe(200)

      const responseData = await response.json()
      expect(responseData.data.message).toBe('Payment already processed')

      // Should not call process_payment RPC
      expect(mockSupabase.rpc).not.toHaveBeenCalled()
    })

    it('should handle RPC processing errors gracefully', async () => {
      mockSupabase.rpc.mockResolvedValue({
        error: { message: 'Database error' },
      })

      const payload = JSON.stringify({
        trx_ref: 'order-123',
        ref_id: 'chapa-ref-123',
        status: 'success',
      })
      const signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {
          'Chapa-Signature': signature,
        },
        body: payload,
      })

      const response = await POST(req)
      // Should return 200 to prevent webhook retries
      expect(response.status).toBe(200)

      const responseData = await response.json()
      expect(responseData.data.message).toContain('logged for investigation')
    })
  })

  describe('Payment Failure Event', () => {
    const mockOrder = {
      id: 'order-123',
      payment_status: 'pending',
      amount: 100,
      customer_email: 'customer@example.com',
    }

    beforeEach(() => {
      const payload = JSON.stringify({
        trx_ref: 'order-123',
        ref_id: 'chapa-ref-123',
        status: 'failed',
      })
      // Signature is prepared for test setup but not used directly in beforeEach
      const _signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      mockChapaClient.verifyWebhookSignature.mockReturnValue(true)

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      })
    })

    it('should update order status to failed', async () => {
      const payload = JSON.stringify({
        trx_ref: 'order-123',
        ref_id: 'chapa-ref-123',
        status: 'failed',
      })
      const signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {
          'Chapa-Signature': signature,
        },
        body: payload,
      })

      const response = await POST(req)
      expect(response.status).toBe(200)

      const responseData = await response.json()
      expect(responseData.data.message).toBe('Payment failure recorded')

      expect(mockSupabase.from).toHaveBeenCalledWith('orders')
      const updateCall = mockSupabase.from('orders').update
      expect(updateCall).toHaveBeenCalledWith({ payment_status: 'failed' })
    })

    it('should handle failure status with "failure" value', async () => {
      const payload = JSON.stringify({
        trx_ref: 'order-123',
        ref_id: 'chapa-ref-123',
        status: 'failure',
      })
      const signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {
          'Chapa-Signature': signature,
        },
        body: payload,
      })

      const response = await POST(req)
      expect(response.status).toBe(200)

      expect(mockSupabase.from('orders').update).toHaveBeenCalled()
    })
  })

  describe('Payment Pending Event', () => {
    it('should handle pending status', async () => {
      const payload = JSON.stringify({
        trx_ref: 'order-123',
        ref_id: 'chapa-ref-123',
        status: 'pending',
      })
      const signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      mockChapaClient.verifyWebhookSignature.mockReturnValue(true)

      const mockOrder = {
        id: 'order-123',
        payment_status: 'pending',
        amount: 100,
      }

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockOrder, error: null }),
          }),
        }),
      })

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {
          'Chapa-Signature': signature,
        },
        body: payload,
      })

      const response = await POST(req)
      expect(response.status).toBe(200)

      const responseData = await response.json()
      expect(responseData.data.message).toBe('Payment pending')
    })
  })

  describe('Error Handling', () => {
    it('should handle missing trx_ref gracefully', async () => {
      const payload = JSON.stringify({
        status: 'success',
      })
      const signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      mockChapaClient.verifyWebhookSignature.mockReturnValue(true)

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {
          'Chapa-Signature': signature,
        },
        body: payload,
      })

      const response = await POST(req)
      expect(response.status).toBe(200)

      const responseData = await response.json()
      expect(responseData.data.message).toContain('missing transaction reference')
    })

    it('should handle order not found gracefully', async () => {
      const payload = JSON.stringify({
        trx_ref: 'non-existent-order',
        status: 'success',
      })
      const signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      mockChapaClient.verifyWebhookSignature.mockReturnValue(true)

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
          }),
        }),
      })

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {
          'Chapa-Signature': signature,
        },
        body: payload,
      })

      const response = await POST(req)
      // Should return 200 to prevent webhook retries
      expect(response.status).toBe(200)

      const responseData = await response.json()
      expect(responseData.data.message).toBe('Order not found')
    })

    it('should handle processing errors gracefully', async () => {
      const payload = JSON.stringify({
        trx_ref: 'order-123',
        status: 'success',
      })
      const signature = crypto
        .createHmac('sha256', 'test-webhook-secret')
        .update(payload)
        .digest('hex')

      mockChapaClient.verifyWebhookSignature.mockReturnValue(true)

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockRejectedValue(new Error('Database error')),
          }),
        }),
      })

      const req = new NextRequest('http://localhost/api/webhooks/chapa', {
        method: 'POST',
        headers: {
          'Chapa-Signature': signature,
        },
        body: payload,
      })

      const response = await POST(req)
      // Should return 200 to prevent webhook retries
      expect(response.status).toBe(200)

      const responseData = await response.json()
      expect(responseData.data.message).toContain('logged for investigation')
    })
  })
})
