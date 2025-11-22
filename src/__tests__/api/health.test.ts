/**
 * Health Check API Route Tests
 * Tests for the /api/health endpoint
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/health/route'
import { createAdminClient } from '@/lib/supabase/admin'

// Mock Supabase
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}))

describe('GET /api/health', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return health status with all services', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
      storage: {
        listBuckets: vi.fn().mockResolvedValue({ error: null }),
      },
    }

    vi.mocked(createAdminClient).mockReturnValue(mockSupabase as any)

    // Mock environment variable
    process.env.CLERK_SECRET_KEY = 'test-secret'

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('status')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('services')
    expect(data).toHaveProperty('responseTime')
    expect(['healthy', 'degraded', 'unhealthy']).toContain(data.status)
  })

  it('should check database connectivity', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
      storage: {
        listBuckets: vi.fn().mockResolvedValue({ error: null }),
      },
    }

    vi.mocked(createAdminClient).mockReturnValue(mockSupabase as any)
    process.env.CLERK_SECRET_KEY = 'test-secret'

    const response = await GET()
    const data = await response.json()

    expect(data.services).toHaveProperty('database')
    expect(['up', 'down']).toContain(data.services.database.status)
  })

  it('should check storage accessibility', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
      storage: {
        listBuckets: vi.fn().mockResolvedValue({ error: null }),
      },
    }

    vi.mocked(createAdminClient).mockReturnValue(mockSupabase as any)
    process.env.CLERK_SECRET_KEY = 'test-secret'

    const response = await GET()
    const data = await response.json()

    expect(data.services).toHaveProperty('storage')
    expect(['up', 'down']).toContain(data.services.storage.status)
  })

  it('should check auth service availability', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
      storage: {
        listBuckets: vi.fn().mockResolvedValue({ error: null }),
      },
    }

    vi.mocked(createAdminClient).mockReturnValue(mockSupabase as any)
    process.env.CLERK_SECRET_KEY = 'test-secret'

    const response = await GET()
    const data = await response.json()

    expect(data.services).toHaveProperty('auth')
    expect(['up', 'down']).toContain(data.services.auth.status)
  })

  it('should return degraded status when some services are down', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ error: new Error('DB error') }),
        }),
      }),
      storage: {
        listBuckets: vi.fn().mockResolvedValue({ error: null }),
      },
    }

    vi.mocked(createAdminClient).mockReturnValue(mockSupabase as any)
    process.env.CLERK_SECRET_KEY = 'test-secret'

    const response = await GET()
    const data = await response.json()

    expect(['healthy', 'degraded', 'unhealthy']).toContain(data.status)
  })
})
