'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Store,
  DollarSign,
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  MoreHorizontal,
  Bot,
  LifeBuoy
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/store-builder', label: 'My Store', icon: Store },
  { href: '/dashboard/income', label: 'Income', icon: DollarSign },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/community', label: 'Community', icon: MessageSquare },
  { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/autodm', label: 'AutoDM', icon: Bot },
  { href: '/dashboard/more', label: 'More', icon: MoreHorizontal },
];

const bottomNavItems = [
  { href: '/dashboard/ask-fabrica', label: 'Ask fabrica', icon: Bot },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/training', label: 'Training', icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="font-semibold text-lg">fabrica</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 space-y-1">
        {bottomNavItems.map((item) => {
           const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <p className="font-semibold text-sm">Creator Name</p>
              <p className="text-xs text-gray-500">@creatorhandle</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
