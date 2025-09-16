'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  BookOpen,
  Users,
  Download,
  MessageSquare,
  Calendar,
  Settings,
  BarChart3,
  Package,
  TrendingUp,
  Eye,
  ShoppingBag,
  MoreHorizontal,
  Play,
  FileText,
  Video
} from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const products = [
    {
      id: 1,
      title: 'Amharic Coding Course',
      type: 'course',
      price: 'ETB 2,500',
      status: 'active',
      sales: 45,
      views: 1250,
      image: '/api/placeholder/80/80',
      description: 'Complete programming course in Amharic'
    },
    {
      id: 2,
      title: 'Digital Art Templates',
      type: 'download',
      price: 'ETB 1,200',
      status: 'active',
      sales: 32,
      views: 890,
      image: '/api/placeholder/80/80',
      description: '50+ customizable art templates'
    },
    {
      id: 3,
      title: 'Business Consulting',
      type: 'coaching',
      price: 'ETB 5,000',
      status: 'active',
      sales: 12,
      views: 340,
      image: '/api/placeholder/80/80',
      description: '1-on-1 business strategy session'
    },
    {
      id: 4,
      title: 'Music Production Pack',
      type: 'download',
      price: 'ETB 3,800',
      status: 'draft',
      sales: 0,
      views: 0,
      image: '/api/placeholder/80/80',
      description: 'Complete music production toolkit'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-4 w-4" />;
      case 'coaching':
        return <MessageSquare className="h-4 w-4" />;
      case 'membership':
        return <Users className="h-4 w-4" />;
      case 'download':
        return <Download className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'bg-blue-100 text-blue-700';
      case 'coaching':
        return 'bg-green-100 text-green-700';
      case 'membership':
        return 'bg-purple-100 text-purple-700';
      case 'download':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-first header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <Link href="/dashboard">
                  <BarChart3 className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Products</h1>
                <p className="text-xs text-gray-500">Manage your digital content</p>
              </div>
            </div>
            <Button size="sm" className="rounded-full" asChild>
              <Link href="/dashboard/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-gray-600">Total Sales</span>
            </div>
            <p className="text-lg font-bold text-gray-900">89</p>
            <p className="text-xs text-green-600">+15% this month</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-600">Revenue</span>
            </div>
            <p className="text-lg font-bold text-gray-900">ETB 185K</p>
            <p className="text-xs text-green-600">+22% this month</p>
          </div>
        </div>

        {/* Product Type Tabs */}
        <div className="bg-white border border-gray-200 rounded-2xl p-1">
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant={activeTab === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('all')}
              className="rounded-xl"
            >
              All
            </Button>
            <Button
              variant={activeTab === 'active' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('active')}
              className="rounded-xl"
            >
              Active
            </Button>
            <Button
              variant={activeTab === 'draft' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('draft')}
              className="rounded-xl"
            >
              Drafts
            </Button>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {products
            .filter(product => activeTab === 'all' || product.status === activeTab)
            .map((product) => (
              <Card key={product.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      {product.type === 'course' && <BookOpen className="h-6 w-6 text-blue-600" />}
                      {product.type === 'coaching' && <MessageSquare className="h-6 w-6 text-green-600" />}
                      {product.type === 'download' && <Download className="h-6 w-6 text-orange-600" />}
                      {product.type === 'membership' && <Users className="h-6 w-6 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                          <p className="text-xs text-gray-600 truncate">{product.description}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`text-xs px-2 py-1 ${getTypeColor(product.type)}`}>
                          {getTypeIcon(product.type)}
                          <span className="ml-1 capitalize">{product.type}</span>
                        </Badge>
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {product.status}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">{product.price}</div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{product.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ShoppingBag className="h-3 w-3" />
                            <span>{product.sales}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Add Product CTA */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Create Your First Product</h3>
          <p className="text-sm text-gray-600 mb-4">
            Start selling courses, coaching, memberships, or digital downloads
          </p>
          <Button className="w-full" asChild>
            <Link href="/dashboard/products/new">
              Add Your First Product
            </Link>
          </Button>
        </div>

        {/* Bottom spacing for mobile */}
        <div className="h-20"></div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-16" asChild>
            <Link href="/dashboard">
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-16 text-blue-600" asChild>
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