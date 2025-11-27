'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Plus, User, LogOut, Settings } from 'lucide-react'
import { SITE_CONTACT_PHONE, SITE_CONTACT_EMAIL } from '@/lib/constants/site'
import { isClerkConfigured } from '@/lib/utils/clerk'

// Extend Window interface for Clerk
declare global {
  interface Window {
    Clerk?: {
      signOut: () => Promise<void>
    }
  }
}

/**
 * Header component that works with or without Clerk
 * When Clerk is not configured, it shows unauthenticated navigation
 *
 * @param isAuthenticated - Optional prop to override authentication state
 *                          When provided, Clerk hooks won't be called
 * @param user - Optional user data (name, email, avatar) for authenticated users
 */
export function Header({
  isAuthenticated: authProp,
  user,
}: {
  isAuthenticated?: boolean
  user?: { name?: string; email?: string; avatar?: string }
} = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const clerkConfigured = isClerkConfigured()

  // If auth prop is provided, use it (means Clerk hooks were called elsewhere)
  // Otherwise, default to false when Clerk is not configured
  const isAuthenticated = authProp !== undefined ? authProp : false
  const showAuthenticatedNav = clerkConfigured && isAuthenticated

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Navigation links based on authentication state
  // Default to unauthenticated when Clerk is not configured
  const navLinks = showAuthenticatedNav
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Products', href: '/dashboard/products' },
        { name: 'Analytics', href: '/dashboard/analytics' },
        { name: 'Settings', href: '/dashboard/settings' },
      ]
    : [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
      ]

  // Mobile menu items
  const mobileMenuItems = showAuthenticatedNav
    ? ['Home', 'Dashboard', 'Products', 'Analytics', 'Settings']
    : ['Home', 'Features', 'Pricing', 'About', 'Contact']

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3',
          'bg-[#F5F5F7] text-black'
        )}
      >
        <div className="max-w-[1920px] mx-auto flex justify-between items-center w-full">
          {/* Logo */}
          <Link href="/" className="text-base font-bold tracking-tight shrink-0">
            fabrica®
          </Link>

          {/* Desktop Nav - Rendered as direct siblings for equal distribution */}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hidden md:block text-base font-medium hover:opacity-70 transition-opacity relative text-center"
            >
              {link.name}
            </Link>
          ))}

          {/* Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group flex flex-col justify-center items-end gap-1.5 w-8 h-8 focus:outline-none shrink-0"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <div className="relative w-6 h-6">
                <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-black rotate-45 transform transition-transform duration-300" />
                <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-black -rotate-45 transform transition-transform duration-300" />
              </div>
            ) : (
              <>
                <span className="w-8 h-0.5 bg-black transform transition-all duration-300 group-hover:w-6" />
                <span className="w-8 h-0.5 bg-black transform transition-all duration-300" />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <div
        className={cn(
          'fixed top-[60px] left-0 right-0 bottom-0 bg-[#F5F5F7] z-40 flex flex-col transition-transform duration-500 ease-in-out',
          isMenuOpen ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        )}
      >
        {/* User Profile Section (if authenticated) - Compact */}
        {showAuthenticatedNav && user && (
          <div className="w-full px-4 sm:px-8 pt-4 pb-2 border-b border-gray-200">
            <div className="max-w-[1920px] mx-auto">
              <div className="flex items-center gap-3">
                {/* Avatar - Smaller */}
                <div className="relative h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-500">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>

                {/* User Info - Compact */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-black truncate">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-600 truncate">{user.email}</p>
                </div>

                {/* Sign Out Button - Inline */}
                <button
                  onClick={() => {
                    // Use Clerk's sign-out
                    if (window.Clerk) {
                      window.Clerk.signOut().then(() => {
                        window.location.href = '/'
                      })
                    } else {
                      window.location.href = '/sign-out'
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center items-center space-y-4">
          <nav className="flex flex-col items-center space-y-2">
            {mobileMenuItems.map((item) => (
              <Link
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-4xl md:text-6xl font-semibold tracking-tight text-black hover:text-gray-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer Info */}
        <div className="w-full px-4 sm:px-8 pb-8 md:pb-12">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-medium uppercase tracking-wide text-black">
            {/* Left: Contact */}
            <div className="space-y-2">
              <div>{SITE_CONTACT_PHONE}</div>
              <div className="flex items-center gap-1">
                <div className="bg-black text-white rounded-full p-0.5">
                  <Plus className="w-2 h-2" />
                </div>
                <a
                  href={`mailto:${SITE_CONTACT_EMAIL}`}
                  className="underline underline-offset-4 hover:no-underline"
                >
                  {SITE_CONTACT_EMAIL}
                </a>
              </div>
            </div>

            {/* Center: Legal */}
            <div className="flex md:justify-center space-x-8">
              <Link href="/privacy" className="hover:opacity-70">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:opacity-70">
                Terms of Service
              </Link>
            </div>

            {/* Right: Copyright */}
            <div className="md:text-right text-gray-500">© 2025 fabrica® Studio</div>
          </div>
        </div>
      </div>
    </>
  )
}
