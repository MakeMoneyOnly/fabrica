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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Download,
  Upload,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  BarChart3,
  ChevronRight,
  Users,
  TrendingUp,
  Clock,
  Star,
  MessageSquare,
  FileText,
  Package,
  ShoppingBag,
  Heart,
  Award,
  Zap,
  Coffee,
  Gift,
  CreditCard,
  Check,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        boxWidth: 8,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      backgroundColor: 'white',
      titleColor: '#111827',
      bodyColor: '#111827',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#6b7280',
      },
    },
    y: {
      grid: {
        color: '#f3f4f6',
      },
      ticks: {
        color: '#6b7280',
      },
    },
  },
};

// Enhanced customer data with more customers
const customers = [
  {
    id: 'CUS001',
    name: 'Emma Thompson',
    email: 'emma.t@example.com',
    phone: '+1 234-567-8901',
    orders: 12,
    spent: 1459.88,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    joinDate: '2023-08-15',
    lastOrder: '2024-02-15',
    segment: 'Regular',
    ltv: 1459.88,
    tags: ['Loyal', 'High Value'],
    notes: 'Prefers eco-friendly products',
    activity: [
      { date: '2024-02-15', type: 'order', description: 'Placed order #ORD001' },
      { date: '2024-02-01', type: 'review', description: 'Left a 5-star review' },
      { date: '2024-01-15', type: 'support', description: 'Contacted support about shipping' }
    ],
    preferences: {
      communication: 'email',
      categories: ['Fashion', 'Accessories'],
      newsletter: true
    }
  },
  {
    id: 'CUS002',
    name: 'James Wilson',
    email: 'james.w@example.com',
    phone: '+1 234-567-8902',
    orders: 8,
    spent: 2789.92,
    status: 'VIP',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop&crop=faces',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'USA'
    },
    joinDate: '2023-06-20',
    lastOrder: '2024-02-10',
    segment: 'Big Spender',
    ltv: 2789.92,
    tags: ['Premium Buyer', 'Tech Savvy'],
    notes: 'Interested in premium products',
    activity: [
      { date: '2024-02-10', type: 'order', description: 'Placed order #ORD015' },
      { date: '2024-01-25', type: 'review', description: 'Left a 4-star review' }
    ],
    preferences: {
      communication: 'phone',
      categories: ['Electronics', 'Gadgets'],
      newsletter: true
    }
  },
  {
    id: 'CUS003',
    name: 'Sophia Chen',
    email: 'sophia.c@example.com',
    phone: '+1 234-567-8903',
    orders: 15,
    spent: 3199.85,
    status: 'VIP',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces',
    address: {
      street: '789 Pine St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94101',
      country: 'USA'
    },
    joinDate: '2023-05-10',
    lastOrder: '2024-02-14',
    segment: 'Loyal',
    ltv: 3199.85,
    tags: ['Brand Enthusiast', 'Fashion Forward'],
    notes: 'Fashion blogger, influences others',
    activity: [
      { date: '2024-02-14', type: 'order', description: 'Placed order #ORD022' },
      { date: '2024-02-05', type: 'review', description: 'Posted product photos' }
    ],
    preferences: {
      communication: 'email',
      categories: ['Fashion', 'Beauty'],
      newsletter: true
    }
  },
  {
    id: 'CUS004',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    phone: '+1 234-567-8904',
    orders: 3,
    spent: 299.94,
    status: 'At Risk',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=64&h=64&fit=crop&crop=faces',
    address: {
      street: '321 Elm St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    },
    joinDate: '2023-11-01',
    lastOrder: '2023-12-01',
    segment: 'At Risk',
    ltv: 299.94,
    tags: ['Price Sensitive', 'Deal Hunter'],
    notes: 'Only purchases during sales',
    activity: [
      { date: '2023-12-01', type: 'order', description: 'Placed order #ORD008' },
      { date: '2023-11-28', type: 'support', description: 'Asked about discounts' }
    ],
    preferences: {
      communication: 'sms',
      categories: ['Electronics'],
      newsletter: false
    }
  },
  {
    id: 'CUS005',
    name: 'Isabella Garcia',
    email: 'isabella.g@example.com',
    phone: '+1 234-567-8905',
    orders: 6,
    spent: 899.90,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=64&h=64&fit=crop&crop=faces',
    address: {
      street: '555 Maple Dr',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'USA'
    },
    joinDate: '2023-09-15',
    lastOrder: '2024-02-01',
    segment: 'Seasonal',
    ltv: 899.90,
    tags: ['Seasonal Shopper', 'Gift Buyer'],
    notes: 'Prefers holiday collections',
    activity: [
      { date: '2024-02-01', type: 'order', description: 'Placed order #ORD019' },
      { date: '2023-12-15', type: 'order', description: 'Holiday shopping' }
    ],
    preferences: {
      communication: 'email',
      categories: ['Home', 'Gifts'],
      newsletter: true
    }
  }
];

const segments = [
  'All',
  'VIP',
  'Regular',
  'At Risk',
  'Inactive',
  'New',
  'Loyal',
  'Big Spender',
  'Occasional',
  'Seasonal'
];

const tags = [
  'Loyal',
  'High Value',
  'New',
  'Returning',
  'Price Sensitive',
  'Premium Buyer',
  'Early Adopter',
  'Seasonal Shopper',
  'Deal Hunter',
  'Brand Enthusiast',
  'Tech Savvy',
  'Fashion Forward',
  'Eco-Conscious',
  'Gift Buyer',
  'Bulk Buyer'
];

// Remove the first OrderHistoryMap interface and update the orderHistory constant
const orderHistory: OrderHistoryMap = {
  'CUS001': [
    {
      id: 'ORD001',
      date: '2024-02-15',
      items: [
        { name: 'Designer Summer Dress', quantity: 1, price: 129.99 },
        { name: 'Leather Crossbody Bag', quantity: 1, price: 129.99 }
      ],
      total: 259.98,
      status: 'Delivered'
    },
    {
      id: 'ORD002',
      date: '2024-01-20',
      items: [
        { name: 'Statement Necklace', quantity: 1, price: 89.99 },
        { name: 'Silk Scarf', quantity: 2, price: 45.99 }
      ],
      total: 181.97,
      status: 'Delivered'
    }
  ],
  'CUS002': [
    {
      id: 'ORD015',
      date: '2024-02-10',
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 299.99 },
        { name: 'Smartwatch', quantity: 1, price: 249.99 }
      ],
      total: 549.98,
      status: 'Delivered'
    }
  ]
} as const;

// Add these types after the imports
interface Product {
  name: string;
  price: number;
  image: string;
  match: number;
  category: string;
  description: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderHistory {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: string;
}

interface RecommendedProducts {
  [key: string]: Product[];
}

interface OrderHistoryMap {
  [key: string]: Array<{
    id: string;
    date: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    status: string;
  }>;
}

// Replace the existing recommendedProducts with this enhanced version
const recommendedProducts: RecommendedProducts = {
  'CUS001': [
    {
      name: 'Floral Maxi Dress',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop',
      match: 98,
      category: 'Fashion',
      description: 'Based on your interest in summer dresses'
    },
    {
      name: 'Premium Tote Bag',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=300&h=300&fit=crop',
      match: 95,
      category: 'Accessories',
      description: 'Complements your recent fashion purchases'
    },
    {
      name: 'Gold Hoop Earrings',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop',
      match: 92,
      category: 'Accessories',
      description: 'Popular among customers with similar style'
    }
  ],
  'CUS002': [
    {
      name: 'Smart Home Hub',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc0d1?w=300&h=300&fit=crop',
      match: 96,
      category: 'Electronics',
      description: 'Complements your smart home devices'
    },
    {
      name: 'Noise-Canceling Earbuds',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop',
      match: 94,
      category: 'Electronics',
      description: 'Based on your interest in audio devices'
    },
    {
      name: 'Fitness Tracker',
      price: 179.99,
      image: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=300&h=300&fit=crop',
      match: 91,
      category: 'Gadgets',
      description: 'Popular among tech enthusiasts'
    }
  ],
  'CUS003': [
    {
      name: 'Designer Sunglasses',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop',
      match: 97,
      category: 'Fashion',
      description: 'Matches your premium fashion preferences'
    },
    {
      name: 'Luxury Skincare Set',
      price: 189.99,
      image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6f841?w=300&h=300&fit=crop',
      match: 95,
      category: 'Beauty',
      description: 'Based on your beauty product interests'
    },
    {
      name: 'Premium Makeup Palette',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop',
      match: 93,
      category: 'Beauty',
      description: 'Trending among beauty enthusiasts'
    }
  ]
};

// Add this type definition after the existing interfaces
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  status: string;
  avatar: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  joinDate: string;
  lastOrder: string;
  segment: string;
  ltv: number;
  tags: string[];
  notes: string;
  activity: Array<{
    date: string;
    type: string;
    description: string;
  }>;
  preferences: {
    communication: string;
    categories: string[];
    newsletter: boolean;
  };
}

export function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [sortField, setSortField] = useState<string>('spent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [newNote, setNewNote] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [recommendProduct, setRecommendProduct] = useState<{product: Product; customer: Customer} | null>(null);
  const [followUps, setFollowUps] = useState<{
    [key: string]: Array<{
      productId: string;
      productName: string;
      dueDate: string;
      status: 'pending' | 'completed' | 'cancelled';
      notes?: string;
    }>;
  }>({});
  const [recommendationHistory, setRecommendationHistory] = useState<{
    [key: string]: Array<{
      productName: string;
      date: string;
      status: 'pending' | 'clicked' | 'purchased' | 'ignored';
      response?: string;
    }>;
  }>({});
  const [bulkRecommendations, setBulkRecommendations] = useState<{
    [key: string]: Product[];
  }>({});

  const { toast } = useToast();

  // Filter customers based on search query and segment
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment = selectedSegment === 'All' || customer.segment === selectedSegment;
    return matchesSearch && matchesSegment;
  }).sort((a, b) => {
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleBulkAction = async (action: 'export' | 'email') => {
    if (selectedCustomers.length === 0) return;

    switch (action) {
      case 'export':
        const selectedCustomersData = customers.filter(c => selectedCustomers.includes(c.id)) as Customer[];
        const csvHeaders = ['ID', 'Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Status', 'Segment'];
        const csvRows = selectedCustomersData.map(customer => [
          customer.id,
          customer.name,
          customer.email,
          customer.phone,
          customer.orders,
          customer.spent.toFixed(2),
          customer.status,
          customer.segment
        ]);
        
        const csvContent = [
          csvHeaders.join(','),
          ...csvRows.map(row => row.join(','))
        ].join('\n');
        
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `customers_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        break;

      case 'email':
        setShowEmailDialog(true);
        // Set default subject and content based on selected customers
        const customerCount = selectedCustomers.length;
        setEmailSubject(`Special Offer for ${customerCount} Selected Customer${customerCount > 1 ? 's' : ''}`);
        setEmailContent(`Dear Valued Customer,

We wanted to reach out to you with a special offer...

Best regards,
Your Store Team`);
        break;
    }
  };

  const handleSendEmail = async () => {
    try {
      setSendingEmail(true);
      const selectedCustomersData = customers.filter(c => selectedCustomers.includes(c.id)) as Customer[];
      
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      toast({
        title: "Emails Sent Successfully",
        description: `Email sent to ${selectedCustomersData.length} customer${selectedCustomersData.length > 1 ? 's' : ''}.`,
      });
      
      // Clear selection and close dialog
      setSelectedCustomers([]);
      setShowEmailDialog(false);
    } catch (error) {
      toast({
        title: "Error Sending Emails",
        description: "There was an error sending the emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const generateBulkRecommendations = (customers: Customer[]) => {
    const newBulkRecommendations: { [key: string]: Product[] } = {};
    customers.forEach(customer => {
      // Simulate AI-powered recommendations based on customer data
      const recommendations = recommendedProducts[customer.id] || [];
      newBulkRecommendations[customer.id] = recommendations;
    });
    setBulkRecommendations(newBulkRecommendations);
  };

  const renderCustomerDetails = () => {
    if (!selectedCustomer) return null;

    return (
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Customer Information</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedCustomer.avatar} />
                      <AvatarFallback>
                        {selectedCustomer.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xl font-medium">{selectedCustomer.name}</div>
                      <div className="text-sm text-gray-500">Customer since {format(new Date(selectedCustomer.joinDate), 'PP')}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{selectedCustomer.address.city}, {selectedCustomer.address.state}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Last order: {format(new Date(selectedCustomer.lastOrder), 'PP')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Customer Metrics</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-gray-500">Total Orders</div>
                    <div className="mt-1 text-2xl font-semibold">{selectedCustomer.orders}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-gray-500">Total Spent</div>
                    <div className="mt-1 text-2xl font-semibold">
                      ${selectedCustomer.spent.toFixed(2)}
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-gray-500">Customer LTV</div>
                    <div className="mt-1 text-2xl font-semibold">
                      ${selectedCustomer.ltv.toFixed(2)}
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-gray-500">Segment</div>
                    <div className="mt-1 text-2xl font-semibold">{selectedCustomer.segment}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium">Customer Preferences</h3>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-gray-500">Preferred Communication</div>
                      <div className="mt-1 flex items-center gap-2">
                        {selectedCustomer.preferences.communication === 'email' ? <Mail className="h-4 w-4" /> :
                         selectedCustomer.preferences.communication === 'phone' ? <Phone className="h-4 w-4" /> :
                         <MessageSquare className="h-4 w-4" />}
                        <span className="capitalize">{selectedCustomer.preferences.communication}</span>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-gray-500">Newsletter Subscription</div>
                      <div className="mt-1">
                        {selectedCustomer.preferences.newsletter ? 
                          <Badge className="bg-green-100 text-green-800">Subscribed</Badge> :
                          <Badge className="bg-gray-100 text-gray-800">Not Subscribed</Badge>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-gray-500">Preferred Categories</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedCustomer.preferences.categories.map((category: string) => (
                        <Badge key={category} variant="secondary">
                          <ShoppingBag className="mr-1 h-3 w-3" />
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-medium">Spending Pattern</h3>
                <div className="mt-4 h-[200px]">
                  <Bar
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                      datasets: [
                        {
                          label: 'Monthly Spending',
                          data: [300, 450, 280, 800, 250, 400],
                          backgroundColor: '#3b82f6',
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium">Tags</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedCustomer.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Orders</span>
                    <span className="font-medium">{selectedCustomer.orders}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Average Order Value</span>
                    <span className="font-medium">
                      ${(selectedCustomer.spent / selectedCustomer.orders).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Order</span>
                    <span className="font-medium">
                      {format(new Date(selectedCustomer.lastOrder), 'PP')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedCustomer.preferences.categories.map((category: string) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Visa ending in 4242</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(orderHistory[selectedCustomer.id] || []).map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{format(new Date(order.date), 'PP')}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="text-sm">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="space-y-4">
            {selectedCustomer.activity.map((event: any, index: number) => (
              <div key={index} className="flex gap-4">
                <div className="relative flex items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    event.type === 'order' ? 'border-blue-600 bg-blue-50' :
                    event.type === 'review' ? 'border-green-600 bg-green-50' :
                    'border-yellow-600 bg-yellow-50'
                  }`}>
                    {event.type === 'order' ? <Package className="h-5 w-5 text-blue-600" /> :
                     event.type === 'review' ? <Star className="h-5 w-5 text-green-600" /> :
                     <MessageSquare className="h-5 w-5 text-yellow-600" />}
                  </div>
                  {index < selectedCustomer.activity.length - 1 && (
                    <div className="absolute bottom-0 left-1/2 h-full w-0.5 -translate-x-1/2 translate-y-full bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="font-medium">{event.description}</div>
                  <div className="mt-1 text-sm text-gray-500">
                    {format(new Date(event.date), 'PPp')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <div>
            <Textarea
              placeholder="Add a note about this customer..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="mb-4"
            />
            <Button onClick={() => {
              if (newNote.trim()) {
                // Add note functionality
                setNewNote('');
              }
            }}>
              Add Note
            </Button>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="font-medium">{selectedCustomer.notes}</div>
              <div className="mt-2 text-sm text-gray-500">
                Added by Admin • {format(new Date(), 'PP')}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {(recommendedProducts[selectedCustomer.id] || []).map((product: Product, index: number) => (
              <Card key={index} className="group relative overflow-hidden">
                <div className="p-4">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">{product.match}% Match</Badge>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-sm font-semibold">
                        ${product.price.toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-3 text-xs" 
                          onClick={() => {
                            setRecommendProduct({ product, customer: selectedCustomer });
                            setEmailSubject(`Personalized Recommendation: ${product.name}`);
                            setEmailContent(`Dear ${selectedCustomer.name},

Based on your recent purchases and preferences, I wanted to personally recommend the ${product.name} that I think would be perfect for you.

${product.description}

Key Features:
• Premium ${product.category} item
• Price: $${product.price.toFixed(2)}
• ${product.match}% match with your style

Would you like to learn more about this item? I'd be happy to provide additional details or answer any questions you might have.

Best regards,
Your Personal Shopper`);
                            setShowEmailDialog(true);
                          }}
                        >
                          <Mail className="mr-1.5 h-3 w-3" />
                          Recommend
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8 px-3 text-xs"
                          onClick={() => {
                            const newFollowUp = {
                              productId: index.toString(),
                              productName: product.name,
                              dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
                              status: 'pending' as const,
                            };
                            
                            setFollowUps(prev => ({
                              ...prev,
                              [selectedCustomer.id]: [
                                ...(prev[selectedCustomer.id] || []),
                                newFollowUp
                              ]
                            }));
                            
                            toast({
                              title: "Added to Follow-up",
                              description: `Follow-up scheduled for ${product.name} in 7 days.`,
                            });
                          }}
                        >
                          <Clock className="mr-1.5 h-3 w-3" />
                          Follow Up
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommendation Insights</CardTitle>
                <CardDescription>
                  Sales opportunities based on {selectedCustomer.name}'s purchase history and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-0.5 h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Upsell Opportunities</div>
                    <div className="text-sm text-gray-500">
                      Customer typically purchases in the ${selectedCustomer.spent / selectedCustomer.orders} range. 
                      Consider suggesting premium alternatives.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShoppingBag className="mt-0.5 h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">Cross-sell Analysis</div>
                    <div className="text-sm text-gray-500">
                      Based on {selectedCustomer.orders} orders in {selectedCustomer.preferences.categories.join(' and ')}.
                      Complementary products have a 78% acceptance rate.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-medium">Timing Suggestions</div>
                    <div className="text-sm text-gray-500">
                      Customer typically makes purchases every {Math.round(30 + Math.random() * 15)} days. 
                      Next predicted purchase: {format(addDays(new Date(), Math.round(15 + Math.random() * 15)), 'PP')}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="font-medium">Engagement Opportunities</div>
                    <div className="text-sm text-gray-500">
                      Most responsive to: {selectedCustomer.preferences.communication === 'email' ? 'Email campaigns' : 'Phone calls'}.
                      Best time to contact: {Math.random() > 0.5 ? 'Morning' : 'Evening'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow-ups</CardTitle>
                <CardDescription>Scheduled follow-ups for this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {followUps[selectedCustomer.id]?.length ? (
                    followUps[selectedCustomer.id].map((followUp, index) => (
                      <div key={index} className="flex items-center justify-between border rounded-lg p-3">
                        <div>
                          <div className="font-medium">{followUp.productName}</div>
                          <div className="text-sm text-gray-500">
                            Due: {format(new Date(followUp.dueDate), 'PP')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            followUp.status === 'completed' ? 'default' :
                            followUp.status === 'cancelled' ? 'destructive' : 
                            'secondary'
                          }>
                            {followUp.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setFollowUps(prev => ({
                                ...prev,
                                [selectedCustomer.id]: prev[selectedCustomer.id].map((f, i) =>
                                  i === index ? { ...f, status: 'completed' } : f
                                )
                              }));
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">
                      No follow-ups scheduled
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('export')}
            disabled={selectedCustomers.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export {selectedCustomers.length > 0 && `(${selectedCustomers.length})`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('email')}
            disabled={selectedCustomers.length === 0}
          >
            <Mail className="mr-2 h-4 w-4" />
            Email {selectedCustomers.length > 0 && `(${selectedCustomers.length})`}
          </Button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                {selectedCustomers.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {selectedCustomers.length} selected
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by segment" />
                </SelectTrigger>
                <SelectContent>
                  {segments.map(segment => (
                    <SelectItem key={segment} value={segment}>{segment}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCustomers.length === filteredCustomers.length}
                      onCheckedChange={(checked) => {
                        setSelectedCustomers(
                          checked ? filteredCustomers.map(c => c.id) : []
                        );
                      }}
                    />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600"
                      onClick={() => handleSort('orders')}
                    >
                      Orders
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600"
                      onClick={() => handleSort('spent')}
                    >
                      Total Spent
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Segment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={(checked) => {
                          setSelectedCustomers(
                            checked
                              ? [...selectedCustomers, customer.id]
                              : selectedCustomers.filter(id => id !== customer.id)
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={customer.avatar} />
                          <AvatarFallback>
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{customer.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(customer.spent)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          customer.status === 'VIP'
                            ? 'bg-purple-100 text-purple-800'
                            : customer.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {customer.segment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        View Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Customer Analytics Section */}
      <div className="dashboard-card">
        <div className="p-6">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Customer Analytics</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Growth & Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line
                      data={{
                        labels: Array.from({ length: 12 }, (_, i) => {
                          const date = new Date();
                          date.setMonth(date.getMonth() - (11 - i));
                          return format(date, 'MMM');
                        }),
                        datasets: [
                          {
                            label: 'New Customers',
                            data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 10),
                            borderColor: '#3b82f6',
                            backgroundColor: '#3b82f6',
                            yAxisID: 'y',
                          },
                          {
                            label: 'Active Customers',
                            data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 200) + 100),
                            borderColor: '#22c55e',
                            backgroundColor: '#22c55e',
                            yAxisID: 'y',
                          },
                          {
                            label: 'Churn Rate',
                            data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 5) + 1),
                            borderColor: '#ef4444',
                            backgroundColor: '#ef4444',
                            yAxisID: 'y1',
                          },
                        ],
                      }}
                      options={{
                        ...chartOptions,
                        scales: {
                          ...chartOptions.scales,
                          y: {
                            position: 'left',
                            title: {
                              display: true,
                              text: 'Number of Customers'
                            },
                            grid: {
                              color: '#f3f4f6',
                            },
                            ticks: {
                              color: '#6b7280',
                            },
                          },
                          y1: {
                            position: 'right',
                            title: {
                              display: true,
                              text: 'Churn Rate (%)'
                            },
                            grid: {
                              drawOnChartArea: false,
                            },
                            ticks: {
                              color: '#6b7280',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Segments Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[300px] items-center justify-center">
                    <div className="h-[250px] w-[250px]">
                      <Doughnut
                        data={{
                          labels: ['VIP', 'Regular', 'At Risk', 'Inactive'],
                          datasets: [
                            {
                              data: [15, 45, 25, 15],
                              backgroundColor: [
                                '#9333ea',
                                '#22c55e',
                                '#eab308',
                                '#ef4444',
                              ],
                              borderColor: '#ffffff',
                              borderWidth: 2,
                            },
                          ],
                        }}
                        options={{
                          cutout: '65%',
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                boxWidth: 8,
                                usePointStyle: true,
                                pointStyle: 'circle',
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">Total Customers</div>
                        <Users className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="mt-1 text-2xl font-semibold">
                        {customers.length}
                      </div>
                      <div className="mt-1 text-sm text-green-600">
                        +12% from last month
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">Active Customers</div>
                        <Users className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="mt-1 text-2xl font-semibold">
                        {customers.filter(c => c.status === 'Active').length}
                      </div>
                      <div className="mt-1 text-sm text-green-600">
                        +8% from last month
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">Average LTV</div>
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="mt-1 text-2xl font-semibold">
                        ${(customers.reduce((sum, c) => sum + c.ltv, 0) / customers.length).toFixed(2)}
                      </div>
                      <div className="mt-1 text-sm text-green-600">
                        +15% from last month
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">Retention Rate</div>
                        <Heart className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="mt-1 text-2xl font-semibold">85%</div>
                      <div className="mt-1 text-sm text-green-600">
                        +3% from last month
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <Bar
                      data={{
                        labels: ['Email', 'Social', 'Direct', 'Referral'],
                        datasets: [
                          {
                            label: 'Engagement Rate',
                            data: [75, 60, 45, 30],
                            backgroundColor: [
                              '#3b82f6',
                              '#22c55e',
                              '#eab308',
                              '#9333ea',
                            ],
                          },
                        ],
                      }}
                      options={{
                        ...chartOptions,
                        indexAxis: 'y',
                        scales: {
                          x: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                              display: true,
                              text: 'Engagement Rate (%)'
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customers.slice(0, 3).map(customer => (
                      <div key={customer.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={customer.avatar} />
                            <AvatarFallback>
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500">
                              Placed an order • {format(new Date(customer.lastOrder), 'PP')}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{customer.segment}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View and manage customer information
            </DialogDescription>
          </DialogHeader>
          {renderCustomerDetails()}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {recommendProduct ? 'Send Product Recommendation' : 'Send Email to Selected Customers'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {recommendProduct 
                ? `Send a personalized recommendation for ${recommendProduct.product.name} to ${recommendProduct.customer.name}`
                : `Compose an email to send to ${selectedCustomers.length} selected customer${selectedCustomers.length > 1 ? 's' : ''}.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Enter email content..."
                className="min-h-[200px]"
              />
            </div>
            {recommendProduct ? (
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-lg">
                    <img
                      src={recommendProduct.product.image}
                      alt={recommendProduct.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{recommendProduct.product.name}</h4>
                    <p className="text-sm text-gray-500">${recommendProduct.product.price.toFixed(2)} • {recommendProduct.product.category}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 font-medium">Selected Customers:</h4>
                <div className="space-y-2">
                  {customers
                    .filter(c => selectedCustomers.includes(c.id))
                    .map(customer => (
                      <div key={customer.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={customer.avatar} />
                            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{customer.name}</span>
                        </div>
                        <span className="text-gray-500">{customer.email}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowEmailDialog(false);
              setRecommendProduct(null);
              if (recommendProduct) {
                setEmailSubject('');
                setEmailContent('');
              }
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  setSendingEmail(true);
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  
                  toast({
                    title: "Email Sent Successfully",
                    description: recommendProduct
                      ? `Product recommendation sent to ${recommendProduct.customer.name}`
                      : `Email sent to ${selectedCustomers.length} customer${selectedCustomers.length > 1 ? 's' : ''}.`,
                  });
                  
                  setShowEmailDialog(false);
                  setRecommendProduct(null);
                  if (recommendProduct) {
                    setEmailSubject('');
                    setEmailContent('');
                  }
                  setSelectedCustomers([]);
                } catch (error) {
                  toast({
                    title: "Error Sending Email",
                    description: "There was an error sending the email. Please try again.",
                    variant: "destructive",
                  });
                } finally {
                  setSendingEmail(false);
                }
              }}
              disabled={!emailSubject.trim() || !emailContent.trim() || sendingEmail}
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}