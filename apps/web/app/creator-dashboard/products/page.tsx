'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Play,
  BookOpen,
  Users,
  FileText,
  Video,
  Package
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

// Mock product data
const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Digital Marketing Mastery Course',
    type: 'course',
    price: 2500,
    currency: 'ETB',
    status: 'published',
    sales: 45,
    revenue: 112500,
    thumbnail: '/api/placeholder/300/200',
    description: 'Complete digital marketing course with 50+ modules',
    createdAt: '2025-01-15',
    downloads: 42
  },
  {
    id: '2',
    title: 'Business Templates Pack',
    type: 'digital',
    price: 1500,
    currency: 'ETB',
    status: 'published',
    sales: 23,
    revenue: 34500,
    thumbnail: '/api/placeholder/300/200',
    description: '100+ professional business templates',
    createdAt: '2025-01-10',
    downloads: 21
  },
  {
    id: '3',
    title: 'Premium Creator Membership',
    type: 'membership',
    price: 5000,
    currency: 'ETB',
    status: 'draft',
    sales: 0,
    revenue: 0,
    thumbnail: '/api/placeholder/300/200',
    description: 'Monthly access to exclusive content and community',
    createdAt: '2025-01-08',
    downloads: 0
  },
  {
    id: '4',
    title: '1-on-1 Business Coaching',
    type: 'coaching',
    price: 10000,
    currency: 'ETB',
    status: 'published',
    sales: 8,
    revenue: 80000,
    thumbnail: '/api/placeholder/300/200',
    description: 'Personal coaching sessions with experienced mentors',
    createdAt: '2025-01-05',
    downloads: 8
  }
];

const PRODUCT_TYPES = [
  { value: 'all', label: 'All Products', icon: <Package className="w-4 h-4" /> },
  { value: 'course', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
  { value: 'digital', label: 'Digital Products', icon: <FileText className="w-4 h-4" /> },
  { value: 'membership', label: 'Memberships', icon: <Users className="w-4 h-4" /> },
  { value: 'coaching', label: 'Coaching', icon: <Video className="w-4 h-4" /> },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || product.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'digital': return <FileText className="w-4 h-4" />;
      case 'membership': return <Users className="w-4 h-4" />;
      case 'coaching': return <Video className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-700';
      case 'digital': return 'bg-green-100 text-green-700';
      case 'membership': return 'bg-purple-100 text-purple-700';
      case 'coaching': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-2">Manage your digital products, courses, and services</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/creator-dashboard/products/import">
                <Download className="w-4 h-4 mr-2" />
                Import
              </Link>
            </Button>
            <Button asChild>
              <Link href="/creator-dashboard/products/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold">76</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold">ETB 227,000</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">ETB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {PRODUCT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Product Image</span>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getTypeColor(product.type)}>
                      {getTypeIcon(product.type)}
                      <span className="ml-1 capitalize">{product.type}</span>
                    </Badge>
                    <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                      {product.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold">{product.currency} {product.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sales:</span>
                      <span className="font-semibold">{product.sales}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-semibold">{product.currency} {product.revenue.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/creator-dashboard/products/${product.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/creator-dashboard/products/${product.id}/edit`}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download Stats
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Product CTA */}
        {filteredProducts.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedType !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by creating your first product.'
                }
              </p>
              <Button asChild>
                <Link href="/creator-dashboard/products/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Product
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
