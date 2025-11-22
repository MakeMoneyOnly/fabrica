import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
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
      <html lang="en">
        <body className={inter.className}>
          <SmoothScroll>{children}</SmoothScroll>
        </body>
      </html>
    </ClerkProvider>
  ) : (
    <html lang="en">
      <body className={inter.className}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )

  return content
}
