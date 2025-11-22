import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryProvider } from '@/lib/react-query/provider'
import SmoothScroll from '@/components/layout/SmoothScroll'
import './globals.css'
import 'locomotive-scroll/dist/locomotive-scroll.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'fabrica',
  description: 'Monetize your audience with your own storefront in Ethiopia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  // Only wrap with ClerkProvider if the key is available
  // This allows the app to build and run without Clerk configuration
  const content = publishableKey ? (
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
