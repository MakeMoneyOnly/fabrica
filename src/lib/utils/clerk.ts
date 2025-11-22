/**
 * Utility functions for Clerk configuration checking
 */

/**
 * Check if Clerk is properly configured
 */
export function isClerkConfigured(): boolean {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return (
    !!publishableKey &&
    publishableKey.length > 20 &&
    (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_')) &&
    !publishableKey.includes('your_') &&
    !publishableKey.includes('xxx')
  )
}
