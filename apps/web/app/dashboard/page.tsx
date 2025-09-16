'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Eye,
  Settings,
  BarChart3,
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  Wallet,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Home</h1>
          <p className="text-gray-500">Welcome back, Creator!</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/store/yourname" target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              View Store
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ETB 45,231.89</div>
            <p className="text-xs text-gray-500">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-gray-500">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-gray-500">+19% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>An overview of your latest store activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">New sale: Amharic Coding Course</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
              <div className="ml-auto font-medium">+ ETB 2,500</div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">New customer: Sarah joined</p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <Eye className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium">45 new store visits from TikTok</p>
                <p className="text-sm text-gray-500">3 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
