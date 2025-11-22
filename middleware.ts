import { clerkMiddleware } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware configuration for Clerk authentication
 *
 * If Clerk is configured with a valid key (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
 * use Clerk's middleware for authentication. Otherwise, provide a
 * pass-through middleware that allows all requests.
 */
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

// Validate Clerk key format before using it
// Clerk keys start with pk_test_ or pk_live_ and are at least 20 characters
const isValidClerkKey =
  publishableKey &&
  publishableKey.length > 20 &&
  (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_')) &&
  !publishableKey.includes('your_') &&
  !publishableKey.includes('xxx')

export default isValidClerkKey
  ? clerkMiddleware()
  : (_req: NextRequest) => {
      // Return early if Clerk is not configured
      // This allows development without Clerk setup
      return new Response(null, { status: 200 })
    }

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
