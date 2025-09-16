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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Calendar as CalendarIcon,
  Filter,
  Download,
  Printer,
  ArrowUpDown,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { generateInvoicePDF, sendOrderEmail } from '@/lib/order-services';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// After the ChartJS registration, add these configurations
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
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            if (context.dataset.label.includes('$')) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(context.parsed.y);
            } else {
              label += context.parsed.y;
            }
          }
          return label;
        }
      }
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

// Mock data for orders
const orders = [
  {
    id: 'ORD001',
    customer: {
      name: 'Emma Thompson',
      email: 'emma.t@example.com',
      phone: '+1 234-567-8901',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      }
    },
    date: '2024-02-15',
    total: 259.98,
    items: [
      {
        id: 'PRD001',
        name: 'Designer Summer Dress',
        price: 129.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=300&h=300&fit=crop'
      },
      {
        id: 'PRD002',
        name: 'Leather Crossbody Bag',
        price: 129.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop'
      }
    ],
    status: 'Delivered',
    payment: {
      method: 'Credit Card',
      card: '**** **** **** 4242',
      status: 'Paid'
    },
    shipping: {
      method: 'Express',
      tracking: '1Z999AA1234567890',
      carrier: 'UPS',
      cost: 12.99
    },
    timeline: [
      { date: '2024-02-15 14:30', status: 'Delivered', message: 'Package delivered to customer' },
      { date: '2024-02-14 09:15', status: 'Out for Delivery', message: 'Package is out for delivery' },
      { date: '2024-02-13 18:20', status: 'In Transit', message: 'Package arrived at local facility' },
      { date: '2024-02-12 11:00', status: 'Shipped', message: 'Order has been shipped' },
      { date: '2024-02-11 16:45', status: 'Processing', message: 'Payment confirmed, processing order' },
      { date: '2024-02-11 16:30', status: 'Placed', message: 'Order placed by customer' }
    ]
  },
  {
    id: 'ORD002',
    customer: {
      name: 'James Wilson',
      email: 'james.w@example.com',
      phone: '+1 234-567-8902',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop&crop=faces',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        country: 'USA'
      }
    },
    date: '2024-02-14',
    total: 89.99,
    items: [
      {
        id: 'PRD003',
        name: 'Statement Necklace',
        price: 89.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop'
      }
    ],
    status: 'Processing',
    payment: {
      method: 'PayPal',
      email: 'james.w@example.com',
      status: 'Paid'
    },
    shipping: {
      method: 'Standard',
      tracking: '',
      carrier: 'USPS',
      cost: 8.99
    },
    timeline: [
      { date: '2024-02-14 10:30', status: 'Processing', message: 'Payment confirmed, processing order' },
      { date: '2024-02-14 10:15', status: 'Placed', message: 'Order placed by customer' }
    ]
  },
  // Add more orders with similar structure...
];

// Add this after the orders mock data
const topProducts = [
  {
    id: 'PRD001',
    name: 'Designer Summer Dress',
    image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=300&h=300&fit=crop',
    orderCount: 45,
    revenue: 5849.55
  },
  {
    id: 'PRD002',
    name: 'Leather Crossbody Bag',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop',
    orderCount: 38,
    revenue: 4939.62
  },
  {
    id: 'PRD003',
    name: 'Statement Necklace',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop',
    orderCount: 32,
    revenue: 2879.68
  }
];

const statuses = ['All', 'Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

export function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [date, setDate] = useState<Date>();
  const [emailSent, setEmailSent] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // Filter orders based on search query, status, and date
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    const matchesDate = !date || format(new Date(order.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    return matchesSearch && matchesStatus && matchesDate;
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

  const handleBulkAction = (action: 'export' | 'print') => {
    if (selectedOrders.length === 0) {
      console.log('No orders selected');
      return;
    }

    const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
    
    switch (action) {
      case 'export':
        // Generate CSV content with proper escaping
        const csvHeaders = ['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Shipping', 'Payment Method'];
        
        // Function to escape CSV fields
        const escapeCSV = (field: any) => {
          const stringField = String(field);
          if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            return `"${stringField.replace(/"/g, '""')}"`;
          }
          return stringField;
        };

        const csvRows = selectedOrdersData.map(order => [
          order.id,
          order.customer.name,
          format(new Date(order.date), 'yyyy-MM-dd'),
          order.items.map(item => `${item.name} (${item.quantity})`).join('; '),
          (order.total + order.shipping.cost).toFixed(2),
          order.status,
          `${order.shipping.method} - ${order.shipping.carrier}`,
          order.payment.method
        ].map(escapeCSV));
        
        const csvContent = [
          csvHeaders.join(','),
          ...csvRows.map(row => row.join(','))
        ].join('\n');
        
        // Create and trigger download with BOM for Excel compatibility
        const BOM = '\uFEFF';
        const csvBlob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const csvUrl = URL.createObjectURL(csvBlob);
        const link = document.createElement('a');
        link.href = csvUrl;
        link.setAttribute('download', `orders_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(csvUrl);
        break;

      case 'print':
        // Create printable content with improved styling
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Orders Report</title>
                <style>
                  body { 
                    font-family: system-ui, -apple-system, sans-serif; 
                    padding: 20px;
                    margin: 0;
                  }
                  table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-top: 20px;
                    font-size: 14px;
                  }
                  th, td { 
                    padding: 12px; 
                    text-align: left; 
                    border: 1px solid #e5e7eb;
                  }
                  th { 
                    background-color: #f9fafb;
                    font-weight: 600;
                  }
                  .header { 
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #e5e7eb;
                  }
                  .header h1 {
                    margin: 0;
                    color: #111827;
                    font-size: 24px;
                  }
                  .header p {
                    margin: 8px 0 0;
                    color: #6b7280;
                  }
                  .status { 
                    padding: 4px 8px; 
                    border-radius: 4px; 
                    font-size: 12px;
                    font-weight: 500;
                    display: inline-block;
                  }
                  .status-delivered { background-color: #dcfce7; color: #166534; }
                  .status-processing { background-color: #fef9c3; color: #854d0e; }
                  .status-shipped { background-color: #dbeafe; color: #1e40af; }
                  .status-cancelled { background-color: #fee2e2; color: #991b1b; }
                  .items-list {
                    font-size: 12px;
                    color: #6b7280;
                    margin-top: 4px;
                  }
                  @media print {
                    body { padding: 0; }
                    .header { margin-bottom: 20px; }
                    table { page-break-inside: auto; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>Orders Report</h1>
                  <p>Generated on ${format(new Date(), 'PPP')} • ${selectedOrdersData.length} orders selected</p>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${selectedOrdersData.map(order => `
                      <tr>
                        <td>${order.id}</td>
                        <td>
                          <div>${order.customer.name}</div>
                          <div style="font-size: 12px; color: #6b7280;">${order.customer.email}</div>
                        </td>
                        <td>${format(new Date(order.date), 'PPP')}</td>
                        <td>
                          <div>${order.items.length} items</div>
                          <div class="items-list">
                            ${order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                          </div>
                        </td>
                        <td>$${(order.total + order.shipping.cost).toFixed(2)}</td>
                        <td>
                          <span class="status status-${order.status.toLowerCase()}">
                            ${order.status}
                          </span>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="4" style="text-align: right; font-weight: 600;">Total Amount:</td>
                      <td colspan="2" style="font-weight: 600;">
                        $${selectedOrdersData.reduce((sum, order) => sum + order.total + order.shipping.cost, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </body>
            </html>
          `);
          printWindow.document.close();
          
          // Wait for images to load before printing
          setTimeout(() => {
            printWindow.print();
          }, 250);
        }
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Shipped':
      case 'Out for Delivery':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'Processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleEmailNotification = async (order: any) => {
    try {
      setEmailSent(true);
      await sendOrderEmail('confirmation', order);
      // Keep success state for 3 seconds
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setEmailSent(false);
    }
  };

  const handleGeneratePDF = async (order: any) => {
    try {
      setPdfGenerating(true);
      const pdfBlob = await generateInvoicePDF(order);
      
      // Create a download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      // Keep generating state for 2 seconds for better UX
      setTimeout(() => setPdfGenerating(false), 2000);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      setPdfGenerating(false);
    }
  };

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Order Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-medium">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium">
                      {format(new Date(selectedOrder.date), 'PPP')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Payment Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method</span>
                    <span className="font-medium">{selectedOrder.payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Card</span>
                    <span className="font-medium">{selectedOrder.payment.card}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      {selectedOrder.payment.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Shipping Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method</span>
                    <span className="font-medium">{selectedOrder.shipping.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Carrier</span>
                    <span className="font-medium">{selectedOrder.shipping.carrier}</span>
                  </div>
                  {selectedOrder.shipping.tracking && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tracking</span>
                      <span className="font-medium">{selectedOrder.shipping.tracking}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Order Items</h3>
              <div className="mt-4 space-y-4">
                {selectedOrder.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-lg border p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity} × ${item.price}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="rounded-lg border p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span>${selectedOrder.shipping.cost.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t pt-2 font-medium">
                    <span>Total</span>
                    <span>${(selectedOrder.total + selectedOrder.shipping.cost).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedOrder.customer.avatar} />
                  <AvatarFallback>
                    {selectedOrder.customer.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedOrder.customer.name}</h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {selectedOrder.customer.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {selectedOrder.customer.phone}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium">Shipping Address</h4>
                <div className="mt-2 rounded-lg border p-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-1 h-4 w-4 text-gray-400" />
                    <div>
                      <p>{selectedOrder.customer.address.street}</p>
                      <p>
                        {selectedOrder.customer.address.city}, {selectedOrder.customer.address.state} {selectedOrder.customer.address.zip}
                      </p>
                      <p>{selectedOrder.customer.address.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium">Order History</h4>
              <div className="mt-2 space-y-4">
                {orders
                  .filter(order => order.customer.email === selectedOrder.customer.email)
                  .map(order => (
                    <div key={order.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{order.id}</div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(order.date), 'PPP')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ${order.total.toFixed(2)}
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <div className="space-y-4">
            {selectedOrder.timeline.map((event: any, index: number) => (
              <div key={index} className="flex gap-4">
                <div className="relative flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-600 bg-white">
                    {getStatusIcon(event.status)}
                  </div>
                  {index < selectedOrder.timeline.length - 1 && (
                    <div className="absolute bottom-0 left-1/2 h-full w-0.5 -translate-x-1/2 translate-y-full bg-gray-200" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="font-medium">{event.status}</div>
                  <div className="text-sm text-gray-500">{event.message}</div>
                  <div className="mt-1 text-xs text-gray-400">
                    {format(new Date(event.date), 'PPP p')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('export')}
            disabled={selectedOrders.length === 0}
            title={selectedOrders.length === 0 ? "Select orders to export" : `Export ${selectedOrders.length} orders`}
          >
            <Download className="mr-2 h-4 w-4" />
            Export {selectedOrders.length > 0 && `(${selectedOrders.length})`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('print')}
            disabled={selectedOrders.length === 0}
            title={selectedOrders.length === 0 ? "Select orders to print" : `Print ${selectedOrders.length} orders`}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print {selectedOrders.length > 0 && `(${selectedOrders.length})`}
          </Button>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="p-6">
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search orders..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {selectedOrders.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {selectedOrders.length} orders selected
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredOrders.length} orders
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600"
                  onClick={() => handleSort('date')}
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600"
                  onClick={() => handleSort('total')}
                >
                  Total
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedOrders.length === filteredOrders.length}
                      onCheckedChange={(checked) => {
                        setSelectedOrders(
                          checked ? filteredOrders.map(order => order.id) : []
                        );
                      }}
                    />
                  </TableHead>
                  <TableHead className="font-medium">Order ID</TableHead>
                  <TableHead className="font-medium">Customer</TableHead>
                  <TableHead className="font-medium">Date</TableHead>
                  <TableHead className="font-medium">Items</TableHead>
                  <TableHead className="font-medium">Total</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) => {
                          setSelectedOrders(
                            checked
                              ? [...selectedOrders, order.id]
                              : selectedOrders.filter(id => id !== order.id)
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={order.customer.avatar} />
                          <AvatarFallback>
                            {order.customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {order.customer.name}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(order.date), 'PPP')}</TableCell>
                    <TableCell>{order.items.length}</TableCell>
                    <TableCell>
                      ${(order.total + order.shipping.cost).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
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

      {/* Analytics Section */}
      <div className="dashboard-card">
        <div className="p-6">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Order Analytics</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Revenue & Orders Trend</h3>
                <div className="mt-4 h-[300px] rounded-lg border p-4">
                  <Line
                    data={{
                      labels: Array.from({ length: 30 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (29 - i));
                        return format(date, 'MMM dd');
                      }),
                      datasets: [
                        {
                          label: 'Revenue ($)',
                          data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000) + 500),
                          borderColor: '#22c55e',
                          backgroundColor: '#22c55e',
                          yAxisID: 'y1',
                        },
                        {
                          label: 'Orders',
                          data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 5),
                          borderColor: '#3b82f6',
                          backgroundColor: '#3b82f6',
                          yAxisID: 'y',
                        },
                      ],
                    }}
                    options={{
                      ...chartOptions,
                      scales: {
                        ...chartOptions.scales,
                        y: {
                          position: 'left',
                          grid: {
                            color: '#f3f4f6',
                          },
                          ticks: {
                            color: '#6b7280',
                          },
                        },
                        y1: {
                          position: 'right',
                          grid: {
                            drawOnChartArea: false,
                          },
                          ticks: {
                            color: '#6b7280',
                            callback: (value) => '$' + value,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Order Status Distribution</h3>
                <div className="mt-4 flex h-[300px] items-center justify-center rounded-lg border p-4">
                  <div className="h-[250px] w-[250px]">
                    <Doughnut
                      data={{
                        labels: ['Delivered', 'Processing', 'Shipped', 'Cancelled'],
                        datasets: [
                          {
                            data: [40, 15, 30, 15],
                            backgroundColor: [
                              '#22c55e',
                              '#eab308',
                              '#3b82f6',
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
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-medium">Order Metrics</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-gray-500">Processing Time</div>
                    <div className="mt-1 text-2xl font-semibold">2.5 days</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-gray-500">Delivery Time</div>
                    <div className="mt-1 text-2xl font-semibold">4 days</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-gray-500">Customer Rating</div>
                    <div className="mt-1 text-2xl font-semibold">4.8/5</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-gray-500">Return Rate</div>
                    <div className="mt-1 text-2xl font-semibold">0%</div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-medium">Top Performing Products</h3>
                <div className="mt-4 space-y-3">
                  {topProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.orderCount} orders
                          </div>
                        </div>
                      </div>
                      <div className="font-medium text-green-600">
                        ${product.revenue.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order {selectedOrder?.id} placed on {selectedOrder && format(new Date(selectedOrder.date), 'PPP')}
            </DialogDescription>
          </DialogHeader>
          {renderOrderDetails()}
        </DialogContent>
      </Dialog>
    </div>
  );
} 