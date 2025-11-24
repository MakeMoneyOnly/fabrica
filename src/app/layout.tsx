import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryProvider } from '@/lib/react-query/provider'
import SmoothScroll from '@/components/layout/SmoothScroll'
import { validateEnvironment } from '@/lib/env'
import './globals.css'
import 'locomotive-scroll/dist/locomotive-scroll.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'fabrica',
  description: 'Monetize your audience with your own storefront in Ethiopia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Validate environment variables on app startup
  const envValidation = validateEnvironment()
  if (!envValidation.success) {
    throw new Error(
      `Environment validation failed:\n${envValidation.errors.map((error) => `  - ${error}`).join('\n')}\n\nPlease check your .env.local file and ensure all required environment variables are set.`
    )
  }

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // Validate Clerk key format before using it
  // Clerk keys start with pk_test_ or pk_live_ and are at least 20 characters
  const isValidClerkKey =
    publishableKey &&
    publishableKey.length > 20 &&
    (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_')) &&
    !publishableKey.includes('your_') &&
    !publishableKey.includes('xxx')

  // Only wrap with ClerkProvider if the key is valid
  // This allows the app to build and run without Clerk configuration
  const content = isValidClerkKey ? (
    <ClerkProvider publishableKey={publishableKey}>
      <QueryProvider>
        <html lang="en">
          <body className={inter.className}>
            <SmoothScroll>{children}</SmoothScroll>
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  ) : (
    <QueryProvider>
      <html lang="en">
        <body className={inter.className}>
          <SmoothScroll>{children}</SmoothScroll>
        </body>
      </html>
    </QueryProvider>
  )

  return content
}
