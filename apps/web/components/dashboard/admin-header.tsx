'use client';

import { Bell, Search, LogOut, User, HelpCircle, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  BarChart,
  Palette,
  Store,
  Eye
} from 'lucide-react';

interface CreatorHeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function CreatorHeader({ currentTab, onTabChange }: CreatorHeaderProps) {
  const tabs = [
    { name: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" />, path: '/dashboard' },
    { name: 'Products', icon: <Package className="h-4 w-4 mr-2" />, path: '/dashboard/products' },
    { name: 'Orders', icon: <ShoppingBag className="h-4 w-4 mr-2" />, path: '/dashboard/orders' },
    { name: 'Customers', icon: <Users className="h-4 w-4 mr-2" />, path: '/dashboard/customers' },
    { name: 'Analytics', icon: <BarChart className="h-4 w-4 mr-2" />, path: '/dashboard/analytics' },
    { name: 'Store Builder', icon: <Palette className="h-4 w-4 mr-2" />, path: '/dashboard/store-builder' },
    { name: 'Preview Store', icon: <Eye className="h-4 w-4 mr-2" />, path: '/dashboard/preview' },
  ];

  return (
    <header className="dashboard-card mb-6">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/images/Vault logo black.svg"
              alt="Vault"
              width={120}
              height={40}
              className="h-8 w-auto object-contain cursor-pointer"
            />
          </Link>
        </div>
        <nav className="flex items-center justify-center flex-1 space-x-2">
          {tabs.map((tab) => (
            <Button
              key={tab.name}
              variant="ghost"
              className={`nav-button ${
                currentTab === tab.name ? 'nav-button-active' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => onTabChange(tab.name)}
            >
              {tab.icon}
              {tab.name}
            </Button>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[300px] rounded-xl border-gray-200 bg-gray-50 pl-9 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl text-gray-600 hover:text-gray-900">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative rounded-full h-9 w-9">
                <Avatar className="h-9 w-9 border border-gray-200">
                  <AvatarImage src="/avatars/01.png" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              </div>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings2 className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
