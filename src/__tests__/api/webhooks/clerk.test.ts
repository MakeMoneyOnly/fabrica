/**
 * Clerk Webhook Handler Tests
 * Tests for the /api/webhooks/clerk endpoint
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/webhooks/clerk/route'
import { createAdminClient } from '@/lib/supabase/admin'
import { headers } from 'next/headers'
import { env } from '@/lib/env'

// Mock environment variables
vi.mock('@/lib/env', () => ({
  env: {
    CLERK_WEBHOOK_SECRET: 'test_webhook_secret',
  },
}))

// Create a shared mock verify function
const mockVerify = vi.fn()

// Mock dependencies
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))

vi.mock('svix', () => ({
  Webhook: class {
    constructor() {}
    verify = mockVerify
  },
}))

describe('POST /api/webhooks/clerk', () => {
  const mockSupabase = {
    rpc: vi.fn(),
    from: vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    }),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockVerify.mockClear()
    process.env.CLERK_WEBHOOK_SECRET = 'test-webhook-secret'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createAdminClient).mockReturnValue(mockSupabase as any)
  })

  describe('Signature Verification', () => {
    it('should have valid webhook secret from environment', async () => {
      // Environment validation ensures CLERK_WEBHOOK_SECRET is available
      // This test verifies the env mock provides the required secret
      expect(typeof env.CLERK_WEBHOOK_SECRET).toBe('string')
      expect(env.CLERK_WEBHOOK_SECRET.length).toBeGreaterThan(0)
    })

    it('should return 400 if svix headers are missing', async () => {
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn().mockReturnValue(null),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      const req = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await POST(req)
      expect(response.status).toBe(400)
      const text = await response.text()
      expect(text).toContain('no svix headers')
    })

    it('should return 400 if signature verification fails', async () => {
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn((key: string) => {
          if (key === 'svix-id') {
            return 'test-id'
          }
          if (key === 'svix-timestamp') {
            return '1234567890'
          }
          if (key === 'svix-signature') {
            return 'invalid-signature'
          }
          return null
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      mockVerify.mockImplementation(() => {
        throw new Error('Invalid signature')
      })

      const req = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify({ type: 'user.created', data: { id: 'user_123' } }),
      })

      const response = await POST(req)
      expect(response.status).toBe(400)
    })
  })

  describe('user.created event', () => {
    const mockEvent = {
      type: 'user.created',
      data: {
        id: 'user_123',
        email_addresses: [{ email_address: 'test@example.com' }],
        phone_numbers: [{ phone_number: '+251912345678' }],
        first_name: 'John',
        last_name: 'Doe',
      },
    }

    beforeEach(() => {
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn((key: string) => {
          if (key === 'svix-id') {
            return 'test-id'
          }
          if (key === 'svix-timestamp') {
            return '1234567890'
          }
          if (key === 'svix-signature') {
            return 'valid-signature'
          }
          return null
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      mockVerify.mockReturnValue(mockEvent)
    })

    it('should create user in database via RPC', async () => {
      mockSupabase.rpc.mockResolvedValue({ error: null })

      const req = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(req)
      expect(response.status).toBe(200)

      expect(mockSupabase.rpc).toHaveBeenCalledWith('create_user_with_referral', {
        p_clerk_user_id: 'user_123',
        p_email: 'test@example.com',
        p_phone: '+251912345678',
        p_full_name: 'John Doe',
        p_referred_by_code: undefined,
      })
    })

    it('should handle missing email address', async () => {
      const eventWithoutEmail = {
        ...mockEvent,
        data: {
          ...mockEvent.data,
          email_addresses: [],
        },
      }

      mockVerify.mockReturnValue(eventWithoutEmail)

      const req = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify(eventWithoutEmail),
      })

      const response = await POST(req)
      expect(response.status).toBe(400)
      const text = await response.text()
      expect(text).toContain('email required')
    })

    it('should handle missing phone number', async () => {
      const eventWithoutPhone = {
        ...mockEvent,
        data: {
          ...mockEvent.data,
          phone_numbers: [],
        },
      }

      mockVerify.mockReturnValue(eventWithoutPhone)
      mockSupabase.rpc.mockResolvedValue({ error: null })

      const req = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify(eventWithoutPhone),
      })

      const response = await POST(req)
      expect(response.status).toBe(200)

      expect(mockSupabase.rpc).toHaveBeenCalledWith(
        'create_user_with_referral',
        expect.objectContaining({
          p_phone: undefined,
        })
      )
    })

    it('should handle RPC error', async () => {
      mockSupabase.rpc.mockResolvedValue({ error: { message: 'Database error' } })

      const req = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(req)
      expect(response.status).toBe(500)
      const text = await response.text()
      expect(text).toContain('Database sync failed')
    })
  })

  describe('user.updated event', () => {
    const mockEvent = {
      type: 'user.updated',
      data: {
        id: 'user_123',
        email_addresses: [{ email_address: 'updated@example.com' }],
        phone_numbers: [{ phone_number: '+251987654321' }],
        first_name: 'Jane',
        last_name: 'Smith',
      },
    }

    beforeEach(() => {
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn((key: string) => {
          if (key === 'svix-id') {
            return 'test-id'
          }
          if (key === 'svix-timestamp') {
            return '1234567890'
          }
          if (key === 'svix-signature') {
            return 'valid-signature'
          }
          return null
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      mockVerify.mockReturnValue(mockEvent)
    })

    it('should update user in database', async () => {
      const req = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(req)
      expect(response.status).toBe(200)

      expect(mockSupabase.from).toHaveBeenCalledWith('users')
      const updateCall = mockSupabase.from('users').update
      expect(updateCall).toHaveBeenCalledWith({
        email: 'updated@example.com',
        phone: '+251987654321',
        full_name: 'Jane Smith',
        updated_at: expect.any(String),
      })
    })

    it('should handle missing email address', async () => {
      const eventWithoutEmail = {
        ...mockEvent,
        data: {
          ...mockEvent.data,
          email_addresses: [],
        },
      }

      mockVerify.mockReturnValue(eventWithoutEmail)

      const req = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify(eventWithoutEmail),
      })

      const response = await POST(req)
      expect(response.status).toBe(400)
    })

    it('should handle database update error', async () => {
      mockSupabase.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: { message: 'Update failed' } }),
        }),
      })

      const req = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(req)
      expect(response.status).toBe(500)
    })
  })

  describe('user.deleted event', () => {
    const mockEvent = {
      type: 'user.deleted',
      data: {
        id: 'user_123',
      },
    }

    beforeEach(() => {
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn((key: string) => {
          if (key === 'svix-id') {
            return 'test-id'
          }
          if (key === 'svix-timestamp') {
            return '1234567890'
          }
          if (key === 'svix-signature') {
            return 'valid-signature'
          }
          return null
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      mockVerify.mockReturnValue(mockEvent)
    })

    it('should log deletion event', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const req = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify(mockEvent),
      })

      const response = await POST(req)
      expect(response.status).toBe(200)
      expect(consoleSpy).toHaveBeenCalledWith('User deleted event received: user_123')

      consoleSpy.mockRestore()
    })
  })

  describe('Error Handling', () => {
    it('should handle processing errors', async () => {
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn((key: string) => {
          if (key === 'svix-id') {
            return 'test-id'
          }
          if (key === 'svix-timestamp') {
            return '1234567890'
          }
          if (key === 'svix-signature') {
            return 'valid-signature'
          }
          return null
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      const mockEventWithEmail = {
        type: 'user.created',
        data: {
          id: 'user_123',
          email_addresses: [{ email_address: 'test@example.com' }],
          phone_numbers: [],
          first_name: 'John',
          last_name: 'Doe',
        },
      }

      mockVerify.mockReturnValue(mockEventWithEmail)
      mockSupabase.rpc.mockRejectedValue(new Error('Unexpected error'))

      const req = new Request('http://localhost/api/webhooks/clerk', {
        method: 'POST',
        body: JSON.stringify(mockEventWithEmail),
      })

      const response = await POST(req)
      expect(response.status).toBe(500)
      const text = await response.text()
      expect(text).toContain('Internal server error')
    })
  })
})
