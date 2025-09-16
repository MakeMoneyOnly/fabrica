'use client';

import { useState } from 'react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { OrdersChart } from '@/components/dashboard/orders-chart';
import { TopProducts } from '@/components/dashboard/top-products';
import { CategoriesChart } from '@/components/dashboard/categories-chart';
import { OrderStatistics } from '@/components/dashboard/order-statistics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Store,
  Palette,
  Smartphone,
  Globe,
  Plus,
  Eye,
  Settings,
  BarChart3,
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  Rocket,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [storeSetupProgress] = useState(85); // Much more complete for Stan Store-like platform

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-first header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">F</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">fabrica</h1>
                <p className="text-xs text-gray-500">Creator Store</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats - Mobile optimized */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
              <p className="text-2xl font-bold text-gray-900">ETB 2,450</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="text-gray-500">vs yesterday</span>
          </div>
        </div>

        {/* Quick Actions - Mobile grid */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="h-20 flex flex-col items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-0" asChild>
            <Link href="/dashboard/products">
              <Package className="h-6 w-6" />
              <span className="text-xs font-medium">Add Product</span>
            </Link>
          </Button>
          <Button className="h-20 flex flex-col items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-0" asChild>
            <Link href="/dashboard/store-builder">
              <Palette className="h-6 w-6" />
              <span className="text-xs font-medium">Design Store</span>
            </Link>
          </Button>
          <Button className="h-20 flex flex-col items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border-0" asChild>
            <Link href="/dashboard/analytics">
              <BarChart3 className="h-6 w-6" />
              <span className="text-xs font-medium">Analytics</span>
            </Link>
          </Button>
          <Button className="h-20 flex flex-col items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-0" asChild>
            <Link href="/dashboard/customers">
              <Users className="h-6 w-6" />
              <span className="text-xs font-medium">Customers</span>
            </Link>
          </Button>
        </div>

        {/* Store Status */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Store Status</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-sm text-gray-600 mb-4">Your store is live and ready to accept orders</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4 text-gray-400" />
              <span>1.2K views</span>
            </div>
            <div className="flex items-center gap-1">
              <ShoppingBag className="h-4 w-4 text-gray-400" />
              <span>23 sales</span>
            </div>
          </div>
        </div>

        {/* Recent Activity - Mobile optimized */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New Sale</p>
                <p className="text-xs text-gray-600">Amharic Coding Course - ETB 2,500</p>
              </div>
              <span className="text-xs text-gray-500">2 min ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New Customer</p>
                <p className="text-xs text-gray-600">Sarah joined your email list</p>
              </div>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Store Visit</p>
                <p className="text-xs text-gray-600">45 visitors from TikTok</p>
              </div>
              <span className="text-xs text-gray-500">3 hours ago</span>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Creator Tip</h3>
              <p className="text-sm text-gray-700">
                Add your fabrica link to your Instagram bio for instant traffic. Use the link: fabrica.store/yourname
              </p>
            </div>
          </div>
        </div>

        {/* Bottom spacing for mobile */}
        <div className="h-20"></div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-16 text-blue-600" asChild>
            <Link href="/dashboard">
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-16" asChild>
            <Link href="/dashboard/products">
              <Package className="h-5 w-5" />
              <span className="text-xs">Products</span>
            </Link>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-16" asChild>
            <Link href="/dashboard/analytics">
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs">Analytics</span>
            </Link>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-16" asChild>
            <Link href="/dashboard/settings">
              <Settings className="h-5 w-5" />
              <span className="text-xs">Settings</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
