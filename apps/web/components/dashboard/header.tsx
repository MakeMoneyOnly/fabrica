'use client';

import { Bell, Search, Settings, LogOut, User, HelpCircle, Settings2 } from 'lucide-react';
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

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ currentTab, onTabChange }: HeaderProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'products', label: 'Products', icon: 'Package' },
    { id: 'orders', label: 'Orders', icon: 'ShoppingCart' },
    { id: 'customers', label: 'Customers', icon: 'Users' },
    { id: 'inventory', label: 'Inventory', icon: 'BoxIcon' },
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
              key={tab.id}
              variant="ghost"
              className={`nav-button ${
                currentTab === tab.id ? 'nav-button-active' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
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
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">sarah@example.com</p>
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
              <DropdownMenuItem className="text-red-600">
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
