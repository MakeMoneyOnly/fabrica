'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Globe,
  Package
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock data for the creator analytics dashboard
const earningsData = [
  { month: 'Jan', earnings: 12500, sales: 145, visitors: 8900 },
  { month: 'Feb', earnings: 15800, sales: 178, visitors: 10200 },
  { month: 'Mar', earnings: 18900, sales: 203, visitors: 11800 },
  { month: 'Apr', earnings: 22100, sales: 245, visitors: 13500 },
  { month: 'May', earnings: 19800, sales: 222, visitors: 12800 },
  { month: 'Jun', earnings: 25600, sales: 289, visitors: 15600 },
];

const contentPerformanceData = [
  { name: 'Amharic Coding Course', sales: 4500, orders: 45, conversion: 12.5 },
  { name: 'Digital Art Templates', sales: 3200, orders: 32, conversion: 8.9 },
  { name: 'Music Production Pack', sales: 2800, orders: 28, conversion: 15.2 },
  { name: 'Business Consulting', sales: 2100, orders: 21, conversion: 6.8 },
];

const trafficSourcesData = [
  { name: 'Direct', value: 35, color: '#3b82f6' },
  { name: 'Social Media', value: 28, color: '#8b5cf6' },
  { name: 'Search', value: 22, color: '#06b6d4' },
  { name: 'Email', value: 10, color: '#22c55e' },
  { name: 'Referral', value: 5, color: '#f59e0b' },
];

const creatorInsights = [
  { metric: 'Store Visitors', value: '3,247', change: '+12.5%', trend: 'up' },
  { metric: 'Content Sales', value: '892', change: '+8.3%', trend: 'up' },
  { metric: 'Average Sale Value', value: 'ETB 2,450', change: '+5.7%', trend: 'up' },
  { metric: 'Conversion Rate', value: '4.2%', change: '+0.8%', trend: 'up' },
];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isLoading, setIsLoading] = useState(false);

  // Ethiopian-inspired gradient colors
  const gradients = {
    primary: 'bg-gradient-to-br from-ethiopian-blue-500 to-ethiopian-blue-600',
    success: 'bg-gradient-to-br from-ethiopian-green-500 to-ethiopian-green-600',
    warning: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
    accent: 'bg-gradient-to-br from-purple-500 to-pink-500',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 space-y-16">
          {/* Modern Hero Section */}
          <section className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight">
                Creator Store Analytics
              </h1>
              <p className="text-xl md:text-2xl font-light text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Track your digital content performance and creator earnings
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Real-time Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Live Updates</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-12">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8">
                <div className="text-center">
                  <div className="text-4xl font-light text-gray-900 mb-2">+24.5%</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">Creator Earnings</div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8">
                <div className="text-center">
                  <div className="text-4xl font-light text-gray-900 mb-2">1.2K</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">Store Visitors</div>
                </div>
              </div>
          </section>

          {/* Quick Actions */}
          <div className="flex items-center justify-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>

          <div className="space-y-16">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {creatorInsights.map((insight, index) => (
                <Card key={insight.metric} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <div className={`h-1 ${index % 2 === 0 ? gradients.primary : gradients.success}`} />
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${index % 2 === 0 ? 'bg-ethiopian-blue-100' : 'bg-ethiopian-green-100'} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        {index === 0 && <Users className={`w-6 h-6 ${index % 2 === 0 ? 'text-ethiopian-blue-600' : 'text-ethiopian-green-600'}`} />}
                        {index === 1 && <Target className={`w-6 h-6 ${index % 2 === 0 ? 'text-ethiopian-blue-600' : 'text-ethiopian-green-600'}`} />}
                        {index === 2 && <DollarSign className={`w-6 h-6 ${index % 2 === 0 ? 'text-ethiopian-blue-600' : 'text-ethiopian-green-600'}`} />}
                        {index === 3 && <Activity className={`w-6 h-6 ${index % 2 === 0 ? 'text-ethiopian-blue-600' : 'text-ethiopian-green-600'}`} />}
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        insight.trend === 'up'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        }`}>
                        {insight.trend === 'up' ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {insight.change}
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{insight.value}</p>
                      <p className="text-sm text-gray-600">{insight.metric}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white shadow-lg border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-ethiopian-blue-50 data-[state=active]:text-ethiopian-blue-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-ethiopian-blue-50 data-[state=active]:text-ethiopian-blue-700">
              <Package className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="traffic" className="data-[state=active]:bg-ethiopian-blue-50 data-[state=active]:text-ethiopian-blue-700">
              <Globe className="w-4 h-4 mr-2" />
              Traffic
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-ethiopian-blue-50 data-[state=active]:text-ethiopian-blue-700">
              <Users className="w-4 h-4 mr-2" />
              Audience
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Revenue Trend Chart */}
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-ethiopian-blue-500 to-ethiopian-blue-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Creator Earnings Trends
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Monthly earnings performance with sales volume
                  </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={earningsData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="month"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `ETB ${value.toLocaleString()}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        }}
                        formatter={(value, name) => [
                          name === 'earnings' ? `ETB ${value.toLocaleString()}` : value,
                          name === 'earnings' ? 'Creator Earnings' : 'Sales'
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Performance Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Page Load Speed</span>
                      <span className="text-sm font-bold text-green-600">2.3s</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Mobile Optimization</span>
                      <span className="text-sm font-bold text-blue-600">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">SEO Score</span>
                      <span className="text-sm font-bold text-purple-600">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">User Engagement</span>
                      <span className="text-sm font-bold text-orange-600">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Real-time Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <ShoppingCart className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New Sale</p>
                          <p className="text-xs text-gray-600">Amharic Coding Course - ETB 2,500</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New Store Visitor</p>
                          <p className="text-xs text-gray-600">Sarah from Addis Ababa</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">5 min ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Eye className="w-4 h-4 text-purple-600" />
                        </div>
                          <div>
                            <p className="text-sm font-medium">Content Engagement</p>
                            <p className="text-xs text-gray-600">45 interactions this hour</p>
                          </div>
                      </div>
                      <span className="text-xs text-gray-500">12 min ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Content Performance
                  </CardTitle>
                  <CardDescription className="text-orange-100">
                    Sales performance and conversion rates by digital content
                  </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={contentPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="name"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `ETB ${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        }}
                        formatter={(value, name) => [
                          name === 'sales' ? `ETB ${value.toLocaleString()}` : `${value}${name === 'conversion' ? '%' : ''}`,
                          name === 'sales' ? 'Revenue' : name === 'orders' ? 'Orders' : 'Conversion'
                        ]}
                      />
                      <Bar dataKey="sales" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Traffic Sources
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={trafficSourcesData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {trafficSourcesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                          }}
                          formatter={(value) => [`${value}%`, 'Traffic']}
                        />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Traffic Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {trafficSourcesData.map((source, index) => (
                    <div key={source.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: source.color }}
                        />
                        <span className="text-sm font-medium">{source.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{source.value}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${source.value}%`,
                              backgroundColor: source.color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Audience Analytics
                  </CardTitle>
                  <CardDescription className="text-pink-100">
                    Deep insights into your audience engagement and demographics
                  </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">2,139</h3>
                    <p className="text-blue-600 font-medium">Store Visitors</p>
                    <p className="text-sm text-gray-600 mt-1">+15.3% from last month</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">3.2%</h3>
                    <p className="text-green-600 font-medium">Purchase Rate</p>
                    <p className="text-sm text-gray-600 mt-1">+0.5% from last month</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">ETB 2,450</h3>
                    <p className="text-purple-600 font-medium">Avg Sale Value</p>
                    <p className="text-sm text-gray-600 mt-1">+8.7% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </div>
        </div>
      </div>
    </div>
  );
}
