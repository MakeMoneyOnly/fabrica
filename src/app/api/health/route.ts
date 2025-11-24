import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/health
 * Health check endpoint for monitoring system status
 * Checks database, storage, and auth service availability
 */
export async function GET() {
  const startTime = Date.now()
  const services: Record<string, { status: 'up' | 'down'; responseTime?: number }> = {}

  // Check database connectivity
  try {
    const dbStartTime = Date.now()
    const supabase = createAdminClient()

    // Try a simple query that should work with basic permissions
    // Use the auth.users table which should be accessible to service role
    const { error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    })

    const dbResponseTime = Date.now() - dbStartTime

    if (error) {
      services.database = { status: 'down' }
    } else {
      services.database = { status: 'up', responseTime: dbResponseTime }
    }
  } catch {
    services.database = { status: 'down' }
  }

  // Check storage accessibility
  try {
    const storageStartTime = Date.now()
    const supabase = createAdminClient()
    const { error } = await supabase.storage.listBuckets()
    const storageResponseTime = Date.now() - storageStartTime

    if (error) {
      services.storage = { status: 'down' }
    } else {
      services.storage = { status: 'up', responseTime: storageResponseTime }
    }
  } catch {
    services.storage = { status: 'down' }
  }

  // Check Clerk auth availability (basic check via environment variable)
  try {
    const clerkSecret = process.env.CLERK_SECRET_KEY
    if (clerkSecret) {
      services.auth = { status: 'up' }
    } else {
      services.auth = { status: 'down' }
    }
  } catch {
    services.auth = { status: 'down' }
  }

  // Determine overall status
  const allUp = Object.values(services).every((service) => service.status === 'up')
  const someDown = Object.values(services).some((service) => service.status === 'down')
  const overallStatus = allUp ? 'healthy' : someDown ? 'degraded' : 'unhealthy'

  const totalResponseTime = Date.now() - startTime

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services,
      responseTime: totalResponseTime,
    },
    {
      status: overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503,
    }
  )
}
