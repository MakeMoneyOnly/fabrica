'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { TrendingUp, Star, Award } from 'lucide-react';

const products = [
  {
    id: '#892341',
    name: 'Designer Summer Floral Maxi Dress',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=64&h=64&fit=crop',
    sales: 89,
    price: 129.99,
    earning: 11569.11,
  },
  {
    id: '#456789',
    name: 'Premium Leather Crossbody Bag',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=64&h=64&fit=crop',
    sales: 76,
    price: 199.99,
    earning: 15199.24,
  },
  {
    id: '#234567',
    name: 'Luxury Statement Necklace Set',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=64&h=64&fit=crop',
    sales: 65,
    price: 89.99,
    earning: 5849.35,
  },
  {
    id: '#678901',
    name: 'Designer Silk Scarf Collection',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=64&h=64&fit=crop',
    sales: 58,
    price: 79.99,
    earning: 4639.42,
  },
];

export function TopProducts() {
  const [timeframe, setTimeframe] = useState('thisYear');

  return (
    <div className="dashboard-card p-8 group hover:shadow-2xl transition-all duration-300">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#4ddc82] to-[#22c55e] shadow-lg">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
            <p className="text-sm text-gray-600 mt-0.5">Your best performing items this period</p>
          </div>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[140px] bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 transition-all duration-200">
            <SelectValue placeholder="This year" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-sm border-white/20">
            <SelectItem value="thisYear" className="hover:bg-gray-50/80">This year</SelectItem>
            <SelectItem value="thisMonth" className="hover:bg-gray-50/80">This month</SelectItem>
            <SelectItem value="lastMonth" className="hover:bg-gray-50/80">Last month</SelectItem>
            <SelectItem value="last6Months" className="hover:bg-gray-50/80">Last 6 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="group/item p-4 rounded-xl bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            style={{
              animationDelay: `${index * 50}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards',
              opacity: 0
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <div className="absolute -top-1 -right-1 z-10">
                    <Badge variant="secondary" className="bg-gradient-to-r from-[#4ddc82] to-[#22c55e] text-white text-xs px-1.5 py-0.5">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border-2 border-white/50 shadow-sm">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate group-hover/item:text-gray-800 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.id}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{product.sales}</div>
                  <div className="text-xs text-gray-500">Sales</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold text-[#4ddc82]">${product.price.toFixed(0)}</div>
                  <div className="text-xs text-gray-500">Price</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">${product.earning.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Earnings</div>
                </div>

                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    +{Math.floor(Math.random() * 20 + 5)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary footer */}
      <div className="mt-6 pt-6 border-t border-white/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-50/50 to-green-100/30 border border-green-200/30">
            <div className="text-xl font-bold text-green-700">288</div>
            <div className="text-xs text-green-600">Total Sales</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-100/30 border border-blue-200/30">
            <div className="text-xl font-bold text-blue-700">$499.97</div>
            <div className="text-xs text-blue-600">Avg. Price</div>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50/50 to-purple-100/30 border border-purple-200/30">
            <div className="text-xl font-bold text-purple-700">$32,257</div>
            <div className="text-xs text-purple-600">Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
}