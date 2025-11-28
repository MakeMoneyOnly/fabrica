'use client'

import { UserButton } from '@clerk/nextjs'
import { Bell, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  // Get current page title from pathname
  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]

    if (!lastSegment || lastSegment === 'dashboard') return 'Overview'

    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Page Title / Breadcrumbs */}
        <div className="flex items-center md:pl-0 pl-12">
          <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          {/* Search (Hidden on mobile for now) */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 text-sm bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-blue-100 w-64 transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* User Profile */}
          <div className="pl-2 border-l border-gray-200">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9',
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
