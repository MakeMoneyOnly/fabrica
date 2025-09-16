'use client';

import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function StatsCards() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$62,543.21',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign
    },
    {
      title: 'Total Orders',
      value: '1,247',
      change: '+8.2%',
      changeType: 'increase',
      icon: ShoppingBag
    },
    {
      title: 'Active Customers',
      value: '3,421',
      change: '+15.3%',
      changeType: 'increase',
      icon: Users
    },
    {
      title: 'Total Products',
      value: '156',
      change: '+5.1%',
      changeType: 'increase',
      icon: Package
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-gray-100">
                  <IconComponent className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex items-center gap-1">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}