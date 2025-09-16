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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Plus,
  Filter,
  AlertTriangle,
  Package,
  Truck,
  BarChart3,
  ArrowUpDown,
  RefreshCcw,
  Warehouse,
  MapPin,
  Phone,
  Mail,
  Building,
  Trash2,
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
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
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Mock data for inventory items
const inventoryItems = [
  {
    id: 'INV001',
    name: 'Premium T-Shirt',
    sku: 'TS-001',
    category: 'Apparel',
    inStock: 150,
    reorderPoint: 50,
    supplier: 'Fashion Wholesale Co.',
    location: 'Warehouse A',
    status: 'In Stock',
    lastUpdated: '2024-02-20',
  },
  {
    id: 'INV002',
    name: 'Leather Wallet',
    sku: 'ACC-001',
    category: 'Accessories',
    inStock: 25,
    reorderPoint: 30,
    supplier: 'Luxury Goods Ltd.',
    location: 'Warehouse B',
    status: 'Low Stock',
    lastUpdated: '2024-02-19',
  },
  {
    id: 'INV003',
    name: 'Wireless Earbuds',
    sku: 'TECH-001',
    category: 'Electronics',
    inStock: 75,
    reorderPoint: 40,
    supplier: 'Tech Distributors Inc.',
    location: 'Warehouse A',
    status: 'In Stock',
    lastUpdated: '2024-02-18',
  },
  {
    id: 'INV004',
    name: 'Running Shoes',
    sku: 'SH-001',
    category: 'Footwear',
    inStock: 10,
    reorderPoint: 25,
    supplier: 'Sports Gear Co.',
    location: 'Warehouse C',
    status: 'Critical',
    lastUpdated: '2024-02-17',
  },
  {
    id: 'INV005',
    name: 'Backpack',
    sku: 'BAG-001',
    category: 'Accessories',
    inStock: 45,
    reorderPoint: 20,
    supplier: 'Bag Suppliers Ltd.',
    location: 'Warehouse B',
    status: 'In Stock',
    lastUpdated: '2024-02-16',
  },
];

const categories = ['All', 'Apparel', 'Accessories', 'Electronics', 'Footwear'];

export function Inventory() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedSupplier, setSelectedSupplier] = useState('All');
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
  const [showAddSupplierDialog, setShowAddSupplierDialog] = useState(false);
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // State for locations and suppliers
  const [locations, setLocations] = useState([
    { id: '1', name: 'Warehouse A', address: '123 Main St', city: 'New York', capacity: 1000, used: 450 },
    { id: '2', name: 'Warehouse B', address: '456 Oak Ave', city: 'Los Angeles', capacity: 800, used: 600 },
  ]);
  
  const [suppliers, setSuppliers] = useState([
    { 
      id: '1', 
      name: 'Fashion Wholesale Co.', 
      contact: 'John Smith',
      email: 'john@fashionwholesale.com',
      phone: '(555) 123-4567',
      address: '789 Fashion Ave, NY',
      activeOrders: 3
    },
    { 
      id: '2', 
      name: 'Tech Distributors Inc.', 
      contact: 'Sarah Lee',
      email: 'sarah@techdist.com',
      phone: '(555) 987-6543',
      address: '321 Tech Blvd, CA',
      activeOrders: 2
    },
  ]);

  // New location form state
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    city: '',
    capacity: '',
  });

  // New supplier form state
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleAddLocation = () => {
    if (newLocation.name && newLocation.address && newLocation.city && newLocation.capacity) {
      setLocations([...locations, {
        id: (locations.length + 1).toString(),
        name: newLocation.name,
        address: newLocation.address,
        city: newLocation.city,
        capacity: parseInt(newLocation.capacity),
        used: 0,
      }]);
      setNewLocation({ name: '', address: '', city: '', capacity: '' });
      setShowAddLocationDialog(false);
      toast({
        title: "Location Added",
        description: `${newLocation.name} has been added successfully.`,
      });
    }
  };

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.email) {
      setSuppliers([...suppliers, {
        id: (suppliers.length + 1).toString(),
        name: newSupplier.name,
        contact: newSupplier.contact,
        email: newSupplier.email,
        phone: newSupplier.phone,
        address: newSupplier.address,
        activeOrders: 0,
      }]);
      setNewSupplier({ name: '', contact: '', email: '', phone: '', address: '' });
      setShowAddSupplierDialog(false);
      toast({
        title: "Supplier Added",
        description: `${newSupplier.name} has been added to your suppliers.`,
      });
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredItems = inventoryItems
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesLocation = selectedLocation === 'All' || item.location === selectedLocation;
      const matchesSupplier = selectedSupplier === 'All' || item.supplier === selectedSupplier;
      return matchesSearch && matchesCategory && matchesLocation && matchesSupplier;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  const getStockStatus = (inStock: number, reorderPoint: number) => {
    if (inStock <= reorderPoint * 0.5) return 'Critical';
    if (inStock <= reorderPoint) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddLocationDialog(true)} variant="outline">
            <MapPin className="mr-2 h-4 w-4" />
            Add Location
          </Button>
          <Button onClick={() => setShowAddSupplierDialog(true)} variant="outline">
            <Truck className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
          <Button onClick={() => setShowAddItemDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{inventoryItems.length}</div>
              <Package className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-yellow-600">
                {inventoryItems.filter(item => item.status === 'Low Stock').length}
              </div>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Active Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {suppliers.length}
              </div>
              <Truck className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Warehouses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {locations.length}
              </div>
              <Warehouse className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <div className="space-y-6">
            <div className="dashboard-card">
              <div className="p-6">
                <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search inventory..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(location => (
                          <SelectItem key={location.id} value={location.name}>{location.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.name}>{supplier.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600"
                            onClick={() => handleSort('name')}
                          >
                            Item Name
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600"
                            onClick={() => handleSort('inStock')}
                          >
                            In Stock
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>Reorder Point</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.inStock}</TableCell>
                          <TableCell>{item.reorderPoint}</TableCell>
                          <TableCell>{item.supplier}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                item.status === 'In Stock'
                                  ? 'bg-green-100 text-green-800'
                                  : item.status === 'Low Stock'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <RefreshCcw className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Level Trends</CardTitle>
                  <CardDescription>30-day inventory level history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line
                      data={{
                        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
                        datasets: [
                          {
                            label: 'Stock Level',
                            data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50),
                            borderColor: 'rgb(59, 130, 246)',
                            tension: 0.1,
                          },
                          {
                            label: 'Reorder Point',
                            data: Array.from({ length: 30 }, () => 30),
                            borderColor: 'rgb(239, 68, 68)',
                            borderDash: [5, 5],
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Warehouse Capacity</CardTitle>
                  <CardDescription>Current storage utilization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Bar
                      data={{
                        labels: locations.map(loc => loc.name),
                        datasets: [
                          {
                            label: 'Used Space',
                            data: locations.map(loc => loc.used),
                            backgroundColor: 'rgb(59, 130, 246)',
                          },
                          {
                            label: 'Available Space',
                            data: locations.map(loc => loc.capacity - loc.used),
                            backgroundColor: 'rgb(229, 231, 235)',
                          },
                        ],
                      }}
                      options={{
                        ...chartOptions,
                        scales: {
                          x: {
                            stacked: true,
                          },
                          y: {
                            stacked: true,
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="locations">
          <div className="dashboard-card">
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>{location.address}</TableCell>
                      <TableCell>{location.city}</TableCell>
                      <TableCell>{location.capacity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${(location.used / location.capacity) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {Math.round((location.used / location.capacity) * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="suppliers">
          <div className="dashboard-card">
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Active Orders</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{supplier.activeOrders}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>
              Enter the details for the new inventory item.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                SKU
              </Label>
              <Input id="sku" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== 'All').map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Initial Stock
              </Label>
              <Input id="stock" type="number" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reorderPoint" className="text-right">
                Reorder Point
              </Label>
              <Input id="reorderPoint" type="number" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.name}>{supplier.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.name}>{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddItemDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddLocationDialog} onOpenChange={setShowAddLocationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>
              Enter the details for the new storage location.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationName" className="text-right">Name</Label>
              <Input
                id="locationName"
                value={newLocation.name}
                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationAddress" className="text-right">Address</Label>
              <Input
                id="locationAddress"
                value={newLocation.address}
                onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationCity" className="text-right">City</Label>
              <Input
                id="locationCity"
                value={newLocation.city}
                onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="locationCapacity" className="text-right">Capacity</Label>
              <Input
                id="locationCapacity"
                type="number"
                value={newLocation.capacity}
                onChange={(e) => setNewLocation({ ...newLocation, capacity: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddLocationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLocation}>Add Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddSupplierDialog} onOpenChange={setShowAddSupplierDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>
              Enter the details for the new supplier.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierName" className="text-right">Company Name</Label>
              <Input
                id="supplierName"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierContact" className="text-right">Contact Person</Label>
              <Input
                id="supplierContact"
                value={newSupplier.contact}
                onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierEmail" className="text-right">Email</Label>
              <Input
                id="supplierEmail"
                type="email"
                value={newSupplier.email}
                onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierPhone" className="text-right">Phone</Label>
              <Input
                id="supplierPhone"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplierAddress" className="text-right">Address</Label>
              <Input
                id="supplierAddress"
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSupplierDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSupplier}>Add Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 