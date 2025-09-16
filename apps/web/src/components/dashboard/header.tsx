'use client';

import { Bell, Search, Settings, LogOut, User, HelpCircle, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BoxIcon,
  BarChart3,
  Store,
  Palette
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ currentTab, onTabChange }: HeaderProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { id: 'products', label: 'Products', icon: <Package className="h-4 w-4 mr-2" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="h-4 w-4 mr-2" /> },
    { id: 'inventory', label: 'Inventory', icon: <BoxIcon className="h-4 w-4 mr-2" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { id: 'store-builder', label: 'Store Builder', icon: <Palette className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-light text-gray-900">fabrica</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentTab === tab.id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden lg:flex relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products, orders..."
              className="w-80 rounded-lg border-gray-200 bg-gray-50 pl-10 focus:bg-white"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-50">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" />
                  <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">SJ</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white/95 backdrop-blur-xl border-gray-200/60 shadow-xl">
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" />
                  <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">SJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">creator@example.com</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-700 font-medium">Active</span>
                  </div>
                </div>
              </div>
              <DropdownMenuItem className="p-3 hover:bg-gray-50">
                <User className="mr-3 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 hover:bg-gray-50">
                <Settings2 className="mr-3 h-4 w-4" />
                <span>Store Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 hover:bg-gray-50">
                <BarChart3 className="mr-3 h-4 w-4" />
                <span>Analytics</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-3 hover:bg-gray-50">
                <HelpCircle className="mr-3 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-3 text-red-600 hover:bg-red-50">
                <LogOut className="mr-3 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}