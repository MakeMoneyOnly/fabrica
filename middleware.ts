import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
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
const isValidClerkKey =
  publishableKey &&
  publishableKey.length > 20 &&
  (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_')) &&
  !publishableKey.includes('your_') &&
  !publishableKey.includes('xxx')

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/onboarding(.*)',
  '/api/products(.*)',
  '/api/orders(.*)',
])

// Define public routes (optional, but good for clarity)
// const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/webhooks(.*)'])

export default isValidClerkKey
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect()
      }
    })
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
