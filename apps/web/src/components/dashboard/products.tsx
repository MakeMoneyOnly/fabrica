'use client';

import { useState, useRef, Fragment, useEffect } from 'react';
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus,
  Search,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Upload,
  ImageIcon,
  LineChart,
  Tag,
  Palette,
  Box,
  CalendarIcon,
  Filter,
  Download,
  Edit,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler,
  BarElement,
  Colors
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CSVImport } from '@/components/dashboard/csv-import';
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
import { toast } from "@/components/ui/use-toast";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler,
  Colors,
  zoomPlugin
);

const defaultProducts = [
  {
    id: 'PRD001',
    name: 'Designer Summer Dress',
    category: 'Dresses',
    price: 129.99,
    stock: 45,
    status: 'In Stock',
    sales: 89,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop'
  },
  {
    id: 'PRD002',
    name: 'Leather Crossbody Bag',
    category: 'Bags',
    price: 89.99,
    stock: 12,
    status: 'Low Stock',
    sales: 76,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop'
  },
  {
    id: 'PRD003',
    name: 'Statement Necklace',
    category: 'Jewelry',
    price: 49.99,
    stock: 30,
    status: 'In Stock',
    sales: 65,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop'
  },
  {
    id: 'PRD004',
    name: 'Silk Scarf Collection',
    category: 'Accessories',
    price: 79.99,
    stock: 8,
    status: 'Low Stock',
    sales: 45,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop'
  },
  {
    id: 'PRD005',
    name: 'Evening Gown',
    category: 'Dresses',
    price: 299.99,
    stock: 0,
    status: 'Out of Stock',
    sales: 34,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=300&h=300&fit=crop'
  },
] as const;

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  sales: number;
  rating: number;
  image: string;
  description?: string;
  variants?: Variant[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  sku?: string;
  barcode?: string;
  weight?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
  features?: string[];
  material?: string;
  color?: string;
  size?: string;
}

interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: {
    size?: string;
    color?: string;
    material?: string;
  };
}

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  image: File | null;
  variants: Variant[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  sku?: string;
  barcode?: string;
  weight?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
  features?: string[];
  material?: string;
  color?: string;
  size?: string;
}

interface ProductDetailsData extends Omit<ProductFormData, 'image'> {
  id: string;
  status: string;
  sales: number;
  rating: number;
  image: string;
  priceHistory?: {
    date: string;
    price: number;
  }[];
  salesHistory?: {
    date: string;
    quantity: number;
    revenue: number;
  }[];
  inventoryAlerts?: {
    type: 'low_stock' | 'out_of_stock';
    message: string;
    date: string;
  }[];
}

interface BulkPriceUpdateData {
  action: 'increase' | 'decrease' | 'set';
  value: number;
}

const PREDEFINED_CATEGORIES = [
  'Dresses',
  'Bags',
  'Watches',
  'Jewelry',
  'Accessories',
  'Shoes',
  'Clothing',
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLOR_OPTIONS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple'];

const DATE_RANGE_OPTIONS = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 3 months', value: '3m' },
  { label: 'Last 6 months', value: '6m' },
  { label: 'Last year', value: '1y' },
  { label: 'All time', value: 'all' }
];

interface AnalyticsMetrics {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  stockTurnoverRate: number;
  profitMargin: number;
}

const MATERIAL_OPTIONS = ['Cotton', 'Polyester', 'Wool', 'Silk', 'Linen', 'Denim', 'Leather'];

// Define a type for the heatmap data
interface HeatmapData {
  days: string[];
  hours: string[];
  data: number[][];
}

// Add this CSS class to your global styles or component
const heatmapStyles = `
  .heatmap-cell {
    height: 48px;
    width: 100%;
    border-radius: 6px;
    transition: all 0.2s ease-in-out;
  }

  .heatmap-cell:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .heatmap-tooltip {
    position: absolute;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 50;
    min-width: 200px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    pointer-events: none;
  }

  .heatmap-cell:hover .heatmap-tooltip {
    opacity: 1;
  }
`;

interface HeatmapCellData {
  salesValue: number;
  totalOrders: number;
  averageOrderValue: number;
  comparedToAverage: number;
  isHighTraffic: boolean;
}

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getHeatmapCellData = (intensity: number): HeatmapCellData => {
  const salesValue = intensity * 150; // Increased base value for more realistic numbers
  const totalOrders = Math.floor(intensity * 12); // More orders for higher intensity
  const averageOrderValue = salesValue / (totalOrders || 1);
  const comparedToAverage = ((salesValue / 300) * 100 - 100);
  const isHighTraffic = intensity > 3;

  return {
    salesValue,
    totalOrders,
    averageOrderValue,
    comparedToAverage,
    isHighTraffic
  };
};

interface CSVProduct {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  stock?: string;
  image?: string;
  [key: string]: string | undefined;
}

interface PriceFormatOptions {
  currency: 'USD' | 'EUR' | 'AED';
  symbol: string;
}

export function Products() {
  // Load products from localStorage on initial render with fallback mechanisms
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        // First try to load the full products data
        const savedProducts = localStorage.getItem('vault-products');
        if (savedProducts) {
          return JSON.parse(savedProducts);
        }
        
        // If full data isn't available, try the reduced version
        const reducedProducts = localStorage.getItem('vault-products-reduced');
        if (reducedProducts) {
          // Parse the reduced data and use default images for any missing images
          const parsedProducts = JSON.parse(reducedProducts);
          return parsedProducts.map((p: any) => ({
            ...p,
            // Use a default image if the image is missing
            image: p.image || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&h=300&fit=crop'
          }));
        }
        
        // If even reduced data isn't available, check if we have IDs
        const productIds = localStorage.getItem('vault-product-ids');
        if (productIds) {
          // If we only have IDs, show a notification that data was partially recovered
          toast({
            title: "Limited Data Recovered",
            description: "Only partial product data could be recovered from local storage.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error loading products from localStorage:', error);
      }
      
      // Fall back to default products if nothing could be loaded
      return [...defaultProducts];
    }
    return [...defaultProducts];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailsData | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: null,
    variants: [],
    seo: {
      title: '',
      description: '',
      keywords: '',
    },
    sku: '',
    barcode: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
    },
    features: [],
    material: '',
    color: '',
    size: '',
  });

  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false);
  const [bulkPriceData, setBulkPriceData] = useState<BulkPriceUpdateData>({
    action: 'increase',
    value: 0,
  });

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [selectedProductForAnalytics, setSelectedProductForAnalytics] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [chartZoom, setChartZoom] = useState({ min: 0, max: 100 });
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const [priceFormat, setPriceFormat] = useState<PriceFormatOptions>({
    currency: 'USD',
    symbol: '$'
  });

  const [showImageUploadDialog, setShowImageUploadDialog] = useState(false);
  const [productsWithoutImages, setProductsWithoutImages] = useState<Product[]>([]);
  const [selectedProductForImage, setSelectedProductForImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const [editingProductDetails, setEditingProductDetails] = useState<Product | null>(null);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);

  // Update localStorage whenever products change
  useEffect(() => {
    try {
      // Try to store the full products data
      localStorage.setItem('vault-products', JSON.stringify(products));
    } catch (error) {
      // If we hit a quota error, store a reduced version of the products
      if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.warn('localStorage quota exceeded, storing reduced product data');
        
        // Create a reduced version of the products with only essential data
        const reducedProducts = products.map(product => ({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
          status: product.status,
          // Omit large data like image URLs (they'll be replaced with default)
          image: product.image && product.image.startsWith('data:') ? '' : product.image,
          sales: product.sales,
          rating: product.rating
        }));
        
        try {
          // Try to store the reduced data
          localStorage.setItem('vault-products-reduced', JSON.stringify(reducedProducts));
          
          // Show a toast notification to inform the user
          toast({
            title: "Storage Limit Reached",
            description: "Some product data (like images) couldn't be saved locally due to browser storage limits.",
            variant: "destructive"
          });
        } catch (fallbackError) {
          // If even the reduced data is too large, just store the IDs
          console.error('Failed to store even reduced product data', fallbackError);
          
          // Store just the product IDs as a last resort
          try {
            localStorage.setItem('vault-product-ids', JSON.stringify(products.map(p => p.id)));
            
            toast({
              title: "Storage Limit Exceeded",
              description: "Unable to save product data locally. Consider exporting important products.",
              variant: "destructive"
            });
          } catch {
            console.error('Failed to store any product data');
          }
        }
      } else {
        console.error('Error storing products in localStorage:', error);
      }
    }
  }, [products]);

  // Get unique categories from all products, including imported ones
  const categories = Array.from(
    new Set(products.map(product => product.category.trim()))
  ).sort((a, b) => a.localeCompare(b));
  
  const statuses = Array.from(
    new Set(products.map(product => product.status.trim()))
  ).sort((a, b) => a.localeCompare(b));

  const filteredProducts = products
    .filter(product => {
      // If there's a search query, filter by name, ID, or description (but not category)
      if (searchQuery) {
        return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
               (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      }
      return true; // If no search query, include all products
    })
    .filter(product => {
      // Simple category filter that matches the UI
      return categoryFilter === 'all' || product.category === categoryFilter;
    })
    .filter(product => {
      // Simple status filter that matches the UI
      return statusFilter === 'all' || product.status === statusFilter;
    })
    .sort((a, b) => {
      // If we're not explicitly sorting by a field, show newest products first
      if (sortField === '' || sortField === null) {
        // Assuming newer products have higher IDs
        return b.id.localeCompare(a.id);
      }
      
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProductDetails) {
      // Update existing product
      const updatedProduct: Product = {
        ...editingProductDetails,
        name: formData.name || 'Untitled Product',
        category: formData.category || 'Uncategorized',
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        status: parseInt(formData.stock) > 20 ? 'In Stock' : 
                parseInt(formData.stock) > 0 ? 'Low Stock' : 'Out of Stock',
        description: formData.description || '',
        // Only update image if a new one was uploaded
        image: previewImage || editingProductDetails.image,
      };
      
      // Update the products array
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      
      toast({
        title: "Product Updated",
        description: `Successfully updated ${updatedProduct.name}.`,
      });
    } else {
      // Create new product
      // Generate a new product ID
      const newId = `PRD${String(products.length + 1).padStart(3, '0')}`;
      
      // Create a new product from form data
      const newProduct: Product = {
        id: newId,
        name: formData.name || 'Untitled Product',
        category: formData.category || 'Uncategorized',
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        status: parseInt(formData.stock) > 20 ? 'In Stock' : 
                parseInt(formData.stock) > 0 ? 'Low Stock' : 'Out of Stock',
        sales: 0,
        rating: 0,
        image: previewImage || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&h=300&fit=crop',
        description: formData.description || '',
      };
      
      // Add the new product to the beginning of the list
      setProducts([newProduct, ...products]);
      
      toast({
        title: "Product Added",
        description: `Successfully added ${newProduct.name} to your products.`,
      });
    }
    
    // Reset form
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      image: null,
      variants: [],
      seo: {
        title: '',
        description: '',
        keywords: '',
      },
      sku: '',
      barcode: '',
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: '',
      },
      features: [],
      material: '',
      color: '',
      size: '',
    });
    setPreviewImage(null);
    setShowProductDialog(false);
    setEditingProductDetails(null);
  };

  // Function to open the edit dialog for a product
  const handleEditProductDetails = (product: Product) => {
    // Set the product being edited
    setEditingProductDetails(product);
    
    // Populate the form with the product's data
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      image: null, // Can't convert URL back to File
      variants: product.variants || [],
      seo: product.seo || {
        title: '',
        description: '',
        keywords: '',
      },
      sku: product.sku || '',
      barcode: product.barcode || '',
      weight: product.weight || '',
      dimensions: product.dimensions || {
        length: '',
        width: '',
        height: '',
      },
      features: product.features || [],
      material: product.material || '',
      color: product.color || '',
      size: product.size || '',
    });
    
    // Set the preview image if the product has one
    if (product.image) {
      setPreviewImage(product.image);
    }
    
    // Open the dialog
    setShowProductDialog(true);
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct({
      ...product,
      description: 'Product description goes here...',
      priceHistory: [
        { date: '2024-01', price: product.price },
        { date: '2024-02', price: product.price * 1.1 },
        { date: '2024-03', price: product.price * 0.95 },
      ],
      salesHistory: [
        { date: '2024-01', quantity: 25, revenue: 3247.50 },
        { date: '2024-02', quantity: 32, revenue: 4156.80 },
        { date: '2024-03', quantity: 28, revenue: 3639.72 },
      ],
      inventoryAlerts: [
        {
          type: 'low_stock',
          message: 'Stock below 20 units',
          date: '2024-03-15',
        },
      ],
      seo: {
        title: product.name,
        description: `Buy ${product.name} - High quality product in ${product.category}`,
        keywords: `${product.category}, fashion, trending, ${product.name}`,
      },
    });
  };

  const handleBulkAction = (action: 'delete' | 'export' | 'update') => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select at least one product to perform this action.",
        variant: "destructive"
      });
      return;
    }

    switch (action) {
      case 'delete':
        // Actually delete the selected products
        const updatedProducts = products.filter(product => !selectedProducts.includes(product.id));
        setProducts(updatedProducts);
        toast({
          title: "Products Deleted",
          description: `Successfully deleted ${selectedProducts.length} products.`,
        });
        // Clear selection after deletion
        setSelectedProducts([]);
        break;
        
      case 'export':
        // Export selected products as CSV
        const selectedProductsData = products.filter(product => selectedProducts.includes(product.id));
        exportProductsToCSV(selectedProductsData);
        break;
        
      case 'update':
        setIsBulkPriceModalOpen(true);
        break;
    }
  };

  // Function to export products to CSV
  const exportProductsToCSV = (productsToExport: Product[]) => {
    // Define CSV headers
    const headers = ['ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Sales', 'Rating', 'Image URL'];
    
    // Convert products to CSV rows
    const rows = productsToExport.map(product => [
      product.id,
      product.name,
      product.category,
      product.price.toString(),
      product.stock.toString(),
      product.status,
      product.sales.toString(),
      product.rating.toString(),
      product.image
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        // Escape commas and quotes in cell values
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"')) 
          ? `"${cell.replace(/"/g, '""')}"` 
          : cell
      ).join(','))
    ].join('\n');
    
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `products_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `Exported ${productsToExport.length} products to CSV.`,
    });
  };

  const handleBulkPriceUpdate = () => {
    if (selectedProducts.length === 0) return;
    
    const updatedProducts = products.map(product => {
      if (selectedProducts.includes(product.id)) {
        let newPrice = product.price;
        
        switch (bulkPriceData.action) {
          case 'increase':
            // Increase by percentage
            newPrice = product.price * (1 + bulkPriceData.value / 100);
            break;
          case 'decrease':
            // Decrease by percentage
            newPrice = product.price * (1 - bulkPriceData.value / 100);
            break;
          case 'set':
            // Set to specific value
            newPrice = bulkPriceData.value;
            break;
        }
        
        return {
          ...product,
          price: parseFloat(newPrice.toFixed(2)) // Round to 2 decimal places
        };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    setIsBulkPriceModalOpen(false);
    
    toast({
      title: "Prices Updated",
      description: `Updated prices for ${selectedProducts.length} products.`,
    });
  };

  const handleProductUpdate = (productId: string, field: keyof Product, value: any) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          [field]: value,
          // Update status automatically when stock changes
          ...(field === 'stock' ? {
            status: parseInt(value) > 20 ? 'In Stock' : 
                   parseInt(value) > 0 ? 'Low Stock' : 
                   'Out of Stock'
          } : {})
        };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    // localStorage update is handled by the useEffect
  };

  const getAnalyticsData = (productId: string | null) => {
    if (!productId) return null;
    const product = products.find(p => p.id === productId);
    if (!product) return null;

    const range = getDateFromRange(selectedDateRange);
    const days = Math.floor((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
    const salesData = Array.from({ length: days }, (_, i) => {
      const date = new Date(range.from);
      date.setDate(date.getDate() + i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        quantity: Math.floor(Math.random() * 50) + 10,
        revenue: parseFloat((Math.random() * 1000 + 500).toFixed(2)),
        price: parseFloat((product.price * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2)),
      };
    });

    return salesData;
  };

  const getDateFromRange = (range: string): { from: Date; to: Date } => {
    const now = new Date();
    const to = now;
    let from = new Date();
    
    switch (range) {
      case '7d':
        from.setDate(now.getDate() - 7);
        break;
      case '30d':
        from.setDate(now.getDate() - 30);
        break;
      case '3m':
        from.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        from.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        from.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        from = new Date(2020, 0, 1); // Set to beginning of 2020 or your preferred start date
        break;
    }
    
    return { from, to };
  };

  const calculateMetrics = (data: any[]): AnalyticsMetrics => {
    if (!data || data.length === 0) return {
      totalSales: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      conversionRate: 0,
      stockTurnoverRate: 0,
      profitMargin: 0
    };

    const totalSales = data.reduce((sum, item) => sum + item.quantity, 0);
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    
    return {
      totalSales,
      totalRevenue,
      averageOrderValue: totalRevenue / totalSales,
      conversionRate: Math.random() * 100, // Mock data - replace with actual calculation
      stockTurnoverRate: totalSales / 100, // Mock data - replace with actual calculation
      profitMargin: (totalRevenue * 0.3) / totalRevenue * 100 // Assuming 30% profit margin
    };
  };

  const getHeatmapData = (productId: string | null): HeatmapData => {
    if (!productId) return { days: [], hours: [], data: [] };
    
    // Use the same days and hours format as order statistics
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['2PM', '3PM', '4PM', '5PM', '6PM', '7PM'];
    
    // Generate a random intensity between 0-5 for each cell
    const data: number[][] = [];
    for (let i = 0; i < hours.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < days.length; j++) {
        // Random intensity between 0-5
        const intensity = Math.floor(Math.random() * 6);
        row.push(intensity);
      }
      data.push(row);
    }
    
    return { days, hours, data };
  };

  const getTrendData = (productId: string | null) => {
    if (!productId) return [];
    
    const range = getDateFromRange(selectedDateRange);
    const days = Math.floor((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
    
    // Generate trend data with seasonal patterns and overall trend
    const trendData = Array.from({ length: days }, (_, i) => {
      const date = new Date(range.from);
      date.setDate(date.getDate() + i);
      
      // Base trend (slightly increasing)
      const baseTrend = 100 + (i / days) * 50;
      
      // Weekly pattern (higher on weekends)
      const dayOfWeek = date.getDay();
      const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 6) ? 30 : 0;
      
      // Monthly pattern (higher at beginning of month)
      const dayOfMonth = date.getDate();
      const monthStart = dayOfMonth <= 5 ? 20 : 0;
      
      // Random noise
      const noise = (Math.random() - 0.5) * 30;
      
      // Seasonal trend (higher in middle of period)
      const seasonalFactor = Math.sin((i / days) * Math.PI) * 40;
      
      const value = Math.max(0, Math.floor(baseTrend + weekendBoost + monthStart + noise + seasonalFactor));
      
      return {
        date: format(date, 'yyyy-MM-dd'),
        value,
        trend: Math.floor(baseTrend),
        seasonal: Math.floor(seasonalFactor + weekendBoost + monthStart),
      };
    });
    
    return trendData;
  };

  const handleAnalyticsClick = (productId: string) => {
    setSelectedProductForAnalytics(productId);
    setShowAnalyticsDialog(true);
  };

  const handleVariantChange = (productId: string, variantId: string, field: string, value: any) => {
    // Here you would typically update the backend
    console.log('Updating variant:', productId, variantId, field, value);
  };

  const handleAddVariant = (productId: string) => {
    const newVariant: Variant = {
      id: `VAR${Math.random().toString(36).substr(2, 9)}`,
      name: 'New Variant',
      sku: '',
      price: 0,
      stock: 0,
      attributes: {},
    };
    // Here you would typically update the backend
    console.log('Adding variant:', productId, newVariant);
  };

  const handleDeleteVariant = (productId: string, variantId: string) => {
    // Here you would typically update the backend
    console.log('Deleting variant:', productId, variantId);
  };

  const renderVariantsTab = (product: any) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Product Variants</h3>
        <Button onClick={() => handleAddVariant(product.id)} className="bg-[#23c55e] hover:bg-[#4ade80]">
          <Plus className="mr-2 h-4 w-4" />
          Add Variant
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-4">
          <h4 className="font-medium">Size Options</h4>
          <div className="grid grid-cols-3 gap-2">
            {SIZE_OPTIONS.map(size => (
              <div key={size} className="flex items-center gap-2">
                <Checkbox 
                  id={`size-${size}-${product.id}`}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleAddVariant(product.id);
                    }
                  }}
                />
                <Label htmlFor={`size-${size}-${product.id}`}>{size}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Color Options</h4>
          <div className="grid grid-cols-2 gap-2">
            {COLOR_OPTIONS.map(color => (
              <div key={color} className="flex items-center gap-2">
                <Checkbox 
                  id={`color-${color}-${product.id}`}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleAddVariant(product.id);
                    }
                  }}
                />
                <Label htmlFor={`color-${color}-${product.id}`}>{color}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Material Options</h4>
          <div className="grid grid-cols-2 gap-2">
            {MATERIAL_OPTIONS.map(material => (
              <div key={material} className="flex items-center gap-2">
                <Checkbox 
                  id={`material-${material}-${product.id}`}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleAddVariant(product.id);
                    }
                  }}
                />
                <Label htmlFor={`material-${material}-${product.id}`}>{material}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="mb-4 font-medium">Variant List</h4>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Variant Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Mock variants - replace with actual data */}
              {[1, 2].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input 
                      defaultValue={`Variant ${index + 1}`}
                      className="max-w-[150px]"
                      onChange={(e) => handleVariantChange(product.id, `var${index}`, 'name', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      defaultValue={`SKU${index + 1}`}
                      className="max-w-[100px]"
                      onChange={(e) => handleVariantChange(product.id, `var${index}`, 'sku', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={SIZE_OPTIONS[0]}
                      onValueChange={(value) => handleVariantChange(product.id, `var${index}`, 'size', value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SIZE_OPTIONS.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={COLOR_OPTIONS[0]}
                      onValueChange={(value) => handleVariantChange(product.id, `var${index}`, 'color', value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLOR_OPTIONS.map(color => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={MATERIAL_OPTIONS[0]}
                      onValueChange={(value) => handleVariantChange(product.id, `var${index}`, 'material', value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MATERIAL_OPTIONS.map(material => (
                          <SelectItem key={material} value={material}>{material}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {editingProduct === product.id ? (
                        <Input
                          type="number"
                          value={product.price}
                          onChange={(e) => handleProductUpdate(product.id, 'price', parseFloat(e.target.value) || 0)}
                          onBlur={() => setEditingProduct(null)}
                          autoFocus
                          className="w-[100px]"
                        />
                      ) : (
                        <span 
                          className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                          onClick={() => setEditingProduct(product.id)}
                        >
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number"
                      defaultValue={Math.floor(product.stock / (index + 2))}
                      className="max-w-[80px]"
                      onChange={(e) => handleVariantChange(product.id, `var${index}`, 'stock', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteVariant(product.id, `var${index}`)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  const formatPrice = (price: number): string => {
    if (priceFormat.currency === 'AED') {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price) + ' AED';
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: priceFormat.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleImportSuccess = (importedProducts: CSVProduct[]) => {
    // Transform imported data to match your product structure
    const transformedProducts: Product[] = importedProducts.map((product, index) => {
      // Process image URL
      let imageUrl = product.image || '';
      
      // If no image URL in the product data, use default
      if (!imageUrl) {
        imageUrl = 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&h=300&fit=crop';
      }
      
      // Ensure category is properly formatted and added to PREDEFINED_CATEGORIES if new
      let category = product.category || 'Uncategorized';
      
      // Capitalize first letter of each word in category if it's not already formatted
      if (category !== 'Uncategorized') {
        category = category
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
          .trim();
      }
      
      return {
      id: `PRD${String(products.length + index + 1).padStart(3, '0')}`,
      name: product.name || 'Untitled Product',
        category: category,
      price: product.price ? parseFloat(product.price) : 0,
      stock: product.stock ? parseInt(product.stock, 10) : 0,
      status: product.stock ? 
        (parseInt(product.stock, 10) > 20 ? 'In Stock' : parseInt(product.stock, 10) > 0 ? 'Low Stock' : 'Out of Stock')
        : 'Out of Stock',
      sales: 0,
      rating: 0,
        image: imageUrl,
      description: product.description || '',
      };
    });

    // Check if any products are missing images
    const missingImages = transformedProducts.filter(product => 
      !product.image || product.image === 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&h=300&fit=crop'
    );
    
    if (missingImages.length > 0) {
      setProductsWithoutImages(missingImages);
      setShowImageUploadDialog(true);
    }
    
    // Add the new products to the beginning of the list instead of the end
    const updatedProducts = [...transformedProducts, ...products];
    
    // Check if we might exceed localStorage limits
    const dataSize = new Blob([JSON.stringify(updatedProducts)]).size;
    const isLikelyToExceedQuota = dataSize > 4 * 1024 * 1024; // 4MB warning threshold
    
    if (isLikelyToExceedQuota) {
      toast({
        title: "Large Data Warning",
        description: "You're importing a large amount of data that may exceed browser storage limits.",
        variant: "destructive"
      });
    }
    
    setProducts(updatedProducts);
    
    // Save to localStorage is handled by the useEffect
    
    // Reset sort field to ensure new products stay at the top
    setSortField('');
    
    toast({
      title: "Import Successful",
      description: `Successfully imported ${transformedProducts.length} products.`,
    });
  };

  const handleImageUploadForProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedProductForImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);
        
        // Update the product with the new image
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === selectedProductForImage 
              ? { ...product, image: imageUrl } 
              : product
          )
        );
        
        // Remove this product from the list of products without images
        setProductsWithoutImages(prev => 
          prev.filter(product => product.id !== selectedProductForImage)
        );
        
        // Clear the selection and uploaded image
        setSelectedProductForImage(null);
        setUploadedImage(null);
        
        toast({
          title: "Image Updated",
          description: "Product image has been updated successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBulkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Create a copy of products without images
    const remainingProducts = [...productsWithoutImages];
    
    // Process each file
    Array.from(files).forEach((file, index) => {
      if (index < remainingProducts.length) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          const productId = remainingProducts[index].id;
          
          // Update the product with the new image
          setProducts(prevProducts => 
            prevProducts.map(product => 
              product.id === productId 
                ? { ...product, image: imageUrl } 
                : product
            )
          );
          
          // Remove this product from the list of products without images
          setProductsWithoutImages(prev => 
            prev.filter(product => product.id !== productId)
          );
        };
        reader.readAsDataURL(file);
      }
    });
    
    toast({
      title: "Images Updated",
      description: `Updated images for ${Math.min(files.length, remainingProducts.length)} products.`,
    });
    
    // Close dialog if all products have images
    if (files.length >= remainingProducts.length) {
      setShowImageUploadDialog(false);
    }
  };

  const currencyOptions = (
    <Select
      value={priceFormat.currency}
      onValueChange={(value: 'USD' | 'EUR' | 'AED') => {
        const symbols = { USD: '$', EUR: '€', AED: '' };
        setPriceFormat({ currency: value, symbol: symbols[value] });
      }}
    >
      <SelectTrigger className="w-[100px] bg-[#4ddc82] text-black border-0 hover:bg-[#4ddc82]/90">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USD">USD ($)</SelectItem>
        <SelectItem value="EUR">EUR (€)</SelectItem>
        <SelectItem value="AED">AED</SelectItem>
      </SelectContent>
    </Select>
  );

  // Add this new function to generate more relevant trend data
  const getEnhancedTrendData = (productId: string | null) => {
    if (!productId) return [];
    
    const product = products.find(p => p.id === productId);
    if (!product) return [];
    
    const range = getDateFromRange(selectedDateRange);
    const days = Math.floor((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
    
    // Get similar products (same category)
    const similarProducts = products.filter(p => 
      p.id !== productId && p.category === product.category
    );
    
    // Calculate average metrics for similar products
    const calculateCategoryAverage = () => {
      if (similarProducts.length === 0) return 0;
      return similarProducts.reduce((sum, p) => sum + p.sales, 0) / similarProducts.length;
    };
    
    const categoryAvgSales = calculateCategoryAverage();
    
    // Generate enhanced trend data with more relevant metrics
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(range.from);
      date.setDate(date.getDate() + i);
      
      // Sales velocity (sales per day)
      const salesVelocity = Math.max(0, (product.sales / 30) * (1 + Math.sin(i / 7) * 0.3 + (Math.random() * 0.4 - 0.2)));
      
      // Stock level trend (decreasing based on sales)
      const initialStock = product.stock + (salesVelocity * days);
      const stockLevel = Math.max(0, initialStock - (salesVelocity * i));
      
      // Category comparison (how this product performs vs category average)
      const categoryPerformance = (product.sales / (categoryAvgSales || 1)) * 100;
      const dailyCategoryPerformance = categoryPerformance * (1 + Math.sin(i / 14) * 0.2 + (Math.random() * 0.1 - 0.05));
      
      // Profit margin trend
      const profitMargin = 35 + Math.sin(i / 10) * 5 + (Math.random() * 2 - 1);
      
      return {
        date: format(date, 'yyyy-MM-dd'),
        salesVelocity: parseFloat(salesVelocity.toFixed(2)),
        stockLevel: Math.round(stockLevel),
        categoryPerformance: parseFloat(dailyCategoryPerformance.toFixed(2)),
        profitMargin: parseFloat(profitMargin.toFixed(2))
      };
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center gap-4">
          {currencyOptions}
          <CSVImport onImportSuccess={handleImportSuccess} />
          <Button onClick={() => setShowProductDialog(true)} className="bg-[#4ddc82] hover:bg-[#4ddc82]/90 text-black">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {selectedProducts.length} products selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('delete')}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              Delete Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('export')}
              className="border-[#4ddc82] text-black hover:bg-[#4ddc82]/10"
            >
              Export Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('update')}
              className="border-[#4ddc82] text-black hover:bg-[#4ddc82]/10"
            >
              Update Prices
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProducts.length === filteredProducts.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedProducts(filteredProducts.map(p => p.id));
                    } else {
                      setSelectedProducts([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (sortField === 'name') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortField('name');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Name
                  {sortField === 'name' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (sortField === 'price') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortField('price');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Price
                  {sortField === 'price' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (sortField === 'stock') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortField('stock');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Stock
                  {sortField === 'stock' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map(product => (
              <TableRow 
                key={product.id} 
                data-product-id={product.id}
                onClick={(e) => {
                  // Prevent any default row click behavior
                  e.stopPropagation();
                }}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedProducts([...selectedProducts, product.id]);
                      } else {
                        setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                          unoptimized
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        value={product.name}
                        onChange={(e) => handleProductUpdate(product.id, 'name', e.target.value)}
                        className="font-medium bg-transparent border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-gray-50"
                      />
                      <div className="text-sm text-gray-500">ID: {product.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={product.category}
                    onValueChange={(value) => handleProductUpdate(product.id, 'category', value)}
                  >
                    <SelectTrigger className="border-0 p-0 h-auto hover:bg-gray-50 focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PREDEFINED_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    {editingProduct === product.id ? (
                      <Input
                        type="number"
                        value={product.price}
                        onChange={(e) => handleProductUpdate(product.id, 'price', parseFloat(e.target.value) || 0)}
                        onBlur={() => setEditingProduct(null)}
                        autoFocus
                        className="w-[100px]"
                      />
                    ) : (
                      <span 
                        className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                        onClick={() => setEditingProduct(product.id)}
                      >
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Input
                    type="number"
                    value={product.stock}
                    onChange={(e) => handleProductUpdate(product.id, 'stock', parseInt(e.target.value) || 0)}
                    className="w-[80px] bg-transparent border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-gray-50"
                  />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={product.status}
                    onValueChange={(value) => handleProductUpdate(product.id, 'status', value)}
                  >
                    <SelectTrigger className="border-0 p-0 h-auto hover:bg-gray-50 focus:ring-0 focus:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Stock">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                          In Stock
                        </div>
                      </SelectItem>
                      <SelectItem value="Low Stock">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                          Low Stock
                        </div>
                      </SelectItem>
                      <SelectItem value="Out of Stock">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                          Out of Stock
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAnalyticsClick(product.id)}
                          >
                            <LineChart className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Analytics</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProductDetails(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Details</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Image Upload Dialog */}
      <AlertDialog open={showImageUploadDialog} onOpenChange={setShowImageUploadDialog}>
        <AlertDialogContent className="max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Add Images to Products</AlertDialogTitle>
            <AlertDialogDescription>
              {productsWithoutImages.length} products were imported without images. 
              You can add images now or later from the product list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Bulk Upload</h3>
              <p className="text-xs text-gray-500">
                Upload multiple images at once. Images will be assigned to products in order.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="bulk-image-upload"
                  onChange={handleBulkImageUpload}
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('bulk-image-upload')?.click()}
                >
                  Select Multiple Images
                </Button>
              </div>
            </div>
            
            {productsWithoutImages.length > 0 && (
              <div className="max-h-[250px] overflow-y-auto border rounded-md p-2">
                <h3 className="text-sm font-medium mb-2">Products Without Images:</h3>
                <ul className="space-y-1">
                  {productsWithoutImages.map(product => (
                    <li key={product.id} className="text-xs flex items-center justify-between">
                      <span>{product.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedProductForImage(product.id);
                          setTimeout(() => imageUploadRef.current?.click(), 100);
                        }}
                      >
                        Add Image
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Skip for Now</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowImageUploadDialog(false)}>
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hidden input for individual image uploads */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={imageUploadRef}
        onChange={handleImageUploadForProduct}
      />

      {/* Add Bulk Price Update Dialog */}
      <Dialog open={isBulkPriceModalOpen} onOpenChange={setIsBulkPriceModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Prices</DialogTitle>
            <DialogDescription>
              Apply bulk price changes to {selectedProducts.length} selected products.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price-action" className="text-right">
                Action
              </Label>
              <Select 
                value={bulkPriceData.action} 
                onValueChange={(value: 'increase' | 'decrease' | 'set') => 
                  setBulkPriceData({...bulkPriceData, action: value})
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase">Increase by %</SelectItem>
                  <SelectItem value="decrease">Decrease by %</SelectItem>
                  <SelectItem value="set">Set to value</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price-value" className="text-right">
                {bulkPriceData.action === 'set' ? 'Price' : 'Percentage'}
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="price-value"
                  type="number"
                  value={bulkPriceData.value}
                  onChange={(e) => setBulkPriceData({
                    ...bulkPriceData, 
                    value: parseFloat(e.target.value) || 0
                  })}
                  className="flex-1"
                  min={0}
                  step={bulkPriceData.action === 'set' ? '0.01' : '1'}
                />
                {bulkPriceData.action !== 'set' && <span>%</span>}
                {bulkPriceData.action === 'set' && <span>{priceFormat.currency}</span>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkPriceModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkPriceUpdate} className="bg-[#4ddc82] hover:bg-[#4ddc82]/90 text-black">
              Apply Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProductDetails ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProductDetails 
                ? 'Update product details and information.' 
                : 'Create a new product with detailed information. You can edit additional details later.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <Tabs defaultValue="basic" className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="variants">Variants</TabsTrigger>
                <TabsTrigger value="seo">SEO & Media</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input
                      id="product-name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({...formData, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREDEFINED_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                        <SelectItem value="custom">+ Add New Category</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.category === 'custom' && (
                      <Input
                        className="mt-2"
                        placeholder="Enter new category name"
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Price</Label>
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-3 py-2 rounded-l-md border border-r-0">
                        {priceFormat.symbol || priceFormat.currency}
                      </span>
                      <Input
                        id="product-price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="rounded-l-none"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-stock">Stock Quantity</Label>
                    <Input
                      id="product-stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter product description"
                    rows={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                      {previewImage ? (
                        <div className="relative h-32 w-32 overflow-hidden rounded-md">
                          <Image
                            src={previewImage}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      id="product-image"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {previewImage && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPreviewImage(null);
                          setFormData({...formData, image: null});
                        }}
                      >
                        Remove Image
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-sku">SKU (Stock Keeping Unit)</Label>
                    <Input
                      id="product-sku"
                      placeholder="e.g. DRESS-RED-L"
                      onChange={(e) => setFormData({
                        ...formData, 
                        sku: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-barcode">Barcode (ISBN, UPC, GTIN, etc.)</Label>
                    <Input
                      id="product-barcode"
                      placeholder="e.g. 9780123456789"
                      onChange={(e) => setFormData({
                        ...formData, 
                        barcode: e.target.value
                      })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-weight">Weight (kg)</Label>
                    <Input
                      id="product-weight"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      onChange={(e) => setFormData({
                        ...formData, 
                        weight: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-dimensions">Dimensions (cm)</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Length"
                        type="number"
                        min="0"
                        onChange={(e) => setFormData({
                          ...formData, 
                          dimensions: {
                            ...formData.dimensions,
                            length: e.target.value
                          }
                        })}
                      />
                      <Input
                        placeholder="Width"
                        type="number"
                        min="0"
                        onChange={(e) => setFormData({
                          ...formData, 
                          dimensions: {
                            ...formData.dimensions,
                            width: e.target.value
                          }
                        })}
                      />
                      <Input
                        placeholder="Height"
                        type="number"
                        min="0"
                        onChange={(e) => setFormData({
                          ...formData, 
                          dimensions: {
                            ...formData.dimensions,
                            height: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Product Attributes</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-material">Material</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {MATERIAL_OPTIONS.map(material => (
                            <SelectItem key={material} value={material}>{material}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-color">Color</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLOR_OPTIONS.map(color => (
                            <SelectItem key={color} value={color}>{color}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-size">Size</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {SIZE_OPTIONS.map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="product-features">Key Features</Label>
                  <Textarea
                    id="product-features"
                    placeholder="Enter key product features, one per line"
                    rows={3}
                    onChange={(e) => setFormData({
                      ...formData, 
                      features: e.target.value.split('\n')
                    })}
                  />
                  <p className="text-xs text-gray-500">Enter each feature on a new line</p>
                </div>
              </TabsContent>
              
              <TabsContent value="variants" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Product Variants</h3>
                  <Button type="button" variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variant
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Size Options</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {SIZE_OPTIONS.map(size => (
                        <div key={size} className="flex items-center gap-2">
                          <Checkbox 
                            id={`size-${size}`}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                // Add size to variants
                              } else {
                                // Remove size from variants
                              }
                            }}
                          />
                          <Label htmlFor={`size-${size}`}>{size}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Color Options</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {COLOR_OPTIONS.map(color => (
                        <div key={color} className="flex items-center gap-2">
                          <Checkbox 
                            id={`color-${color}`}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                // Add color to variants
                              } else {
                                // Remove color from variants
                              }
                            }}
                          />
                          <Label htmlFor={`color-${color}`}>{color}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Material Options</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {MATERIAL_OPTIONS.map(material => (
                        <div key={material} className="flex items-center gap-2">
                          <Checkbox 
                            id={`material-${material}`}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                // Add material to variants
                              } else {
                                // Remove material from variants
                              }
                            }}
                          />
                          <Label htmlFor={`material-${material}`}>{material}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Variant Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No variants created yet. Select options above to generate variants.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="seo" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="seo-title">SEO Title</Label>
                  <Input
                    id="seo-title"
                    placeholder="SEO optimized title (appears in search results)"
                    onChange={(e) => setFormData({
                      ...formData, 
                      seo: {
                        ...formData.seo,
                        title: e.target.value
                      }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seo-description">Meta Description</Label>
                  <Textarea
                    id="seo-description"
                    placeholder="Brief description for search engines"
                    rows={3}
                    onChange={(e) => setFormData({
                      ...formData, 
                      seo: {
                        ...formData.seo,
                        description: e.target.value
                      }
                    })}
                  />
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Recommended: 150-160 characters</span>
                    <span>{formData.seo?.description?.length || 0} characters</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="seo-keywords">Keywords</Label>
                  <Input
                    id="seo-keywords"
                    placeholder="e.g. dress, summer, fashion (comma separated)"
                    onChange={(e) => setFormData({
                      ...formData, 
                      seo: {
                        ...formData.seo,
                        keywords: e.target.value
                      }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Additional Images</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((index) => (
                      <div 
                        key={index}
                        className="border border-dashed border-gray-300 rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="h-6 w-6 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-500">Image {index}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Add up to 5 additional product images</p>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => {
                setShowProductDialog(false);
                setEditingProductDetails(null);
              }}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#4ddc82] hover:bg-[#4ddc82]/90 text-black">
                {editingProductDetails ? 'Update Product' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Analytics Dialog */}
      <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Analytics for {products.find(p => p.id === selectedProductForAnalytics)?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed performance metrics and sales data for this product.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedProductForAnalytics && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Performance Overview
                  </h2>
                  <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DATE_RANGE_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border bg-white p-4">
                    <h4 className="text-sm font-medium text-gray-500">Total Sales</h4>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {calculateMetrics(getAnalyticsData(selectedProductForAnalytics) || []).totalSales}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">units</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <h4 className="text-sm font-medium text-gray-500">Total Revenue</h4>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      ${calculateMetrics(getAnalyticsData(selectedProductForAnalytics) || []).totalRevenue.toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">USD</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <h4 className="text-sm font-medium text-gray-500">Average Order Value</h4>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      ${calculateMetrics(getAnalyticsData(selectedProductForAnalytics) || []).averageOrderValue.toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">per order</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <h4 className="text-sm font-medium text-gray-500">Conversion Rate</h4>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {calculateMetrics(getAnalyticsData(selectedProductForAnalytics) || []).conversionRate.toFixed(1)}%
                    </p>
                    <p className="mt-1 text-sm text-gray-600">of visitors</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <h4 className="text-sm font-medium text-gray-500">Stock Turnover Rate</h4>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {calculateMetrics(getAnalyticsData(selectedProductForAnalytics) || []).stockTurnoverRate.toFixed(1)}x
                    </p>
                    <p className="mt-1 text-sm text-gray-600">per period</p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <h4 className="text-sm font-medium text-gray-500">Profit Margin</h4>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {calculateMetrics(getAnalyticsData(selectedProductForAnalytics) || []).profitMargin.toFixed(1)}%
                    </p>
                    <p className="mt-1 text-sm text-gray-600">average</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Sales History</h3>
                    <div className="h-[400px] rounded-lg border bg-white p-4">
                      <Line
                        data={{
                          labels: getAnalyticsData(selectedProductForAnalytics)?.map(item => item.date) || [],
                          datasets: [
                            {
                              label: 'Units Sold',
                              data: getAnalyticsData(selectedProductForAnalytics)?.map(item => item.quantity) || [],
                              borderColor: '#22c55e',
                              backgroundColor: '#22c55e',
                              tension: 0.4,
                              pointStyle: 'circle',
                              pointRadius: 4,
                              pointHoverRadius: 6,
                            },
                            {
                              label: 'Revenue',
                              data: getAnalyticsData(selectedProductForAnalytics)?.map(item => item.revenue) || [],
                              borderColor: '#3b82f6',
                              backgroundColor: '#3b82f6',
                              tension: 0.4,
                              pointStyle: 'circle',
                              pointRadius: 4,
                              pointHoverRadius: 6,
                              yAxisID: 'revenue',
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          interaction: {
                            mode: 'index',
                            intersect: false,
                          },
                          plugins: {
                            zoom: {
                              zoom: {
                                wheel: {
                                  enabled: true,
                                },
                                pinch: {
                                  enabled: true,
                                },
                                mode: 'x',
                              },
                              pan: {
                                enabled: true,
                                mode: 'x',
                              },
                            },
                            legend: {
                              position: 'top',
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
                                label: function(context) {
                                  if (context.datasetIndex === 0) {
                                    return `Units: ${context.parsed.y}`;
                                  } else {
                                    return `Revenue: $${context.parsed.y}`;
                                  }
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
                              min: chartZoom.min,
                              max: chartZoom.max,
                            },
                            y: {
                              type: 'linear',
                              display: true,
                              position: 'left',
                              grid: {
                                color: '#f3f4f6',
                              },
                              ticks: {
                                color: '#6b7280',
                              },
                            },
                            revenue: {
                              type: 'linear',
                              display: true,
                              position: 'right',
                              grid: {
                                drawOnChartArea: false,
                              },
                              ticks: {
                                color: '#6b7280',
                                callback: function(value) {
                                  return '$' + value;
                                }
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Price History</h3>
                    <div className="h-[400px] rounded-lg border bg-white p-4">
                      <Line
                        data={{
                          labels: getAnalyticsData(selectedProductForAnalytics)?.map(item => item.date) || [],
                          datasets: [
                            {
                              label: 'Price',
                              data: getAnalyticsData(selectedProductForAnalytics)?.map(item => item.price) || [],
                              borderColor: '#22c55e',
                              backgroundColor: 'rgba(34, 197, 94, 0.1)',
                              tension: 0.4,
                              fill: true,
                              pointStyle: 'circle',
                              pointRadius: 4,
                              pointHoverRadius: 6,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          interaction: {
                            mode: 'index',
                            intersect: false,
                          },
                          plugins: {
                            zoom: {
                              zoom: {
                                wheel: {
                                  enabled: true,
                                },
                                pinch: {
                                  enabled: true,
                                },
                                mode: 'x',
                              },
                              pan: {
                                enabled: true,
                                mode: 'x',
                              },
                            },
                            legend: {
                              position: 'top',
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
                                label: function(context) {
                                  return `Price: $${context.parsed.y.toFixed(2)}`;
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
                              min: chartZoom.min,
                              max: chartZoom.max,
                            },
                            y: {
                              grid: {
                                color: '#f3f4f6',
                              },
                              ticks: {
                                color: '#6b7280',
                                callback: function(value) {
                                  return '$' + value;
                                }
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Product Performance Insights</h3>
                    <div className="h-[400px] rounded-lg border bg-white p-4">
                      <Tabs defaultValue="sales">
                        <TabsList className="mb-4">
                          <TabsTrigger value="sales">Sales & Stock</TabsTrigger>
                          <TabsTrigger value="category">Category Comparison</TabsTrigger>
                          <TabsTrigger value="profit">Profit Analysis</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="sales" className="h-[320px]">
                          <Line
                            data={{
                              labels: getEnhancedTrendData(selectedProductForAnalytics).map(item => item.date),
                              datasets: [
                                {
                                  label: 'Sales Velocity',
                                  data: getEnhancedTrendData(selectedProductForAnalytics).map(item => item.salesVelocity),
                                  borderColor: '#8b5cf6',
                                  backgroundColor: '#8b5cf6',
                                  tension: 0.4,
                                  pointStyle: 'circle',
                                  pointRadius: 2,
                                  pointHoverRadius: 5,
                                  yAxisID: 'y',
                                },
                                {
                                  label: 'Stock Level',
                                  data: getEnhancedTrendData(selectedProductForAnalytics).map(item => item.stockLevel),
                                  borderColor: '#f43f5e',
                                  backgroundColor: 'rgba(244, 63, 94, 0.1)',
                                  tension: 0.4,
                                  fill: true,
                                  pointRadius: 0,
                                  pointHoverRadius: 0,
                                  yAxisID: 'y1',
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              interaction: {
                                mode: 'index',
                                intersect: false,
                              },
                              plugins: {
                                legend: {
                                  position: 'top',
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
                                    label: function(context) {
                                      if (context.dataset.label === 'Sales Velocity') {
                                        return `Sales Velocity: ${context.parsed.y} units/day`;
                                      } else {
                                        return `Stock Level: ${context.parsed.y} units`;
                                      }
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
                                    maxRotation: 0,
                                    autoSkip: true,
                                    maxTicksLimit: 10,
                                  },
                                },
                                y: {
                                  type: 'linear',
                                  display: true,
                                  position: 'left',
                                  title: {
                                    display: true,
                                    text: 'Sales Velocity (units/day)',
                                    color: '#8b5cf6',
                                    font: {
                                      size: 10,
                                    },
                                  },
                                  grid: {
                                    color: '#f3f4f6',
                                  },
                                  ticks: {
                                    color: '#8b5cf6',
                                  },
                                  beginAtZero: true,
                                },
                                y1: {
                                  type: 'linear',
                                  display: true,
                                  position: 'right',
                                  title: {
                                    display: true,
                                    text: 'Stock Level (units)',
                                    color: '#f43f5e',
                                    font: {
                                      size: 10,
                                    },
                                  },
                                  grid: {
                                    drawOnChartArea: false,
                                  },
                                  ticks: {
                                    color: '#f43f5e',
                                  },
                                  beginAtZero: true,
                                },
                              },
                            }}
                          />
                          <div className="mt-2 text-xs text-gray-500">
                            <p>💡 <strong>Insight:</strong> This chart shows your daily sales rate compared to remaining stock. 
                            {getEnhancedTrendData(selectedProductForAnalytics).length > 0 && 
                              getEnhancedTrendData(selectedProductForAnalytics)[0].stockLevel / 
                              getEnhancedTrendData(selectedProductForAnalytics)[0].salesVelocity < 30 ? (
                              <span className="text-amber-600 font-medium"> At the current sales rate, you may run out of stock in approximately {Math.round(
                                getEnhancedTrendData(selectedProductForAnalytics)[0].stockLevel / 
                                getEnhancedTrendData(selectedProductForAnalytics)[0].salesVelocity
                              )} days. Consider restocking soon.</span>
                            ) : (
                              <span> Your current stock levels appear sufficient based on the sales velocity.</span>
                            )}
                            </p>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="category" className="h-[320px]">
                          <Line
                            data={{
                              labels: getEnhancedTrendData(selectedProductForAnalytics).map(item => item.date),
                              datasets: [
                                {
                                  label: 'Category Performance',
                                  data: getEnhancedTrendData(selectedProductForAnalytics).map(item => item.categoryPerformance),
                                  borderColor: '#0ea5e9',
                                  backgroundColor: 'rgba(14, 165, 233, 0.1)',
                                  tension: 0.4,
                                  fill: true,
                                  pointRadius: 2,
                                  pointHoverRadius: 5,
                                },
                                {
                                  label: 'Category Average (100%)',
                                  data: getEnhancedTrendData(selectedProductForAnalytics).map(() => 100),
                                  borderColor: '#6b7280',
                                  backgroundColor: '#6b7280',
                                  borderWidth: 1,
                                  borderDash: [5, 5],
                                  pointRadius: 0,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              interaction: {
                                mode: 'index',
                                intersect: false,
                              },
                              plugins: {
                                legend: {
                                  position: 'top',
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
                                    label: function(context) {
                                      if (context.dataset.label === 'Category Performance') {
                                        return `Performance: ${context.parsed.y.toFixed(1)}% of category average`;
                                      } else {
                                        return `Category Average: 100%`;
                                      }
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
                                    maxRotation: 0,
                                    autoSkip: true,
                                    maxTicksLimit: 10,
                                  },
                                },
                                y: {
                                  grid: {
                                    color: '#f3f4f6',
                                  },
                                  ticks: {
                                    color: '#6b7280',
                                    callback: function(value) {
                                      return value + '%';
                                    }
                                  },
                                  title: {
                                    display: true,
                                    text: 'Performance vs Category Average (%)',
                                    color: '#6b7280',
                                    font: {
                                      size: 10,
                                    },
                                  },
                                },
                              },
                            }}
                          />
                          <div className="mt-2 text-xs text-gray-500">
                            <p>💡 <strong>Insight:</strong> This chart compares this product's performance against the average of similar products in the same category.
                            {getEnhancedTrendData(selectedProductForAnalytics).length > 0 && 
                              getEnhancedTrendData(selectedProductForAnalytics)[0].categoryPerformance > 100 ? (
                              <span className="text-green-600 font-medium"> This product is outperforming others in its category by approximately {(
                                getEnhancedTrendData(selectedProductForAnalytics)[0].categoryPerformance - 100
                              ).toFixed(1)}%.</span>
                            ) : getEnhancedTrendData(selectedProductForAnalytics).length > 0 ? (
                              <span className="text-amber-600 font-medium"> This product is underperforming compared to others in its category by approximately {(
                                100 - getEnhancedTrendData(selectedProductForAnalytics)[0].categoryPerformance
                              ).toFixed(1)}%. Consider price adjustments or promotions.</span>
                            ) : (
                              <span> No comparison data available.</span>
                            )}
                            </p>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="profit" className="h-[320px]">
                          <Line
                            data={{
                              labels: getEnhancedTrendData(selectedProductForAnalytics).map(item => item.date),
                              datasets: [
                                {
                                  label: 'Profit Margin',
                                  data: getEnhancedTrendData(selectedProductForAnalytics).map(item => item.profitMargin),
                                  borderColor: '#22c55e',
                                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                  tension: 0.4,
                                  fill: true,
                                  pointRadius: 2,
                                  pointHoverRadius: 5,
                                },
                                {
                                  label: 'Target Margin (30%)',
                                  data: getEnhancedTrendData(selectedProductForAnalytics).map(() => 30),
                                  borderColor: '#6b7280',
                                  backgroundColor: '#6b7280',
                                  borderWidth: 1,
                                  borderDash: [5, 5],
                                  pointRadius: 0,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              interaction: {
                                mode: 'index',
                                intersect: false,
                              },
                              plugins: {
                                legend: {
                                  position: 'top',
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
                                    label: function(context) {
                                      if (context.dataset.label === 'Profit Margin') {
                                        return `Profit Margin: ${context.parsed.y.toFixed(1)}%`;
                                      } else {
                                        return `Target Margin: 30%`;
                                      }
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
                                    maxRotation: 0,
                                    autoSkip: true,
                                    maxTicksLimit: 10,
                                  },
                                },
                                y: {
                                  grid: {
                                    color: '#f3f4f6',
                                  },
                                  ticks: {
                                    color: '#6b7280',
                                    callback: function(value) {
                                      return value + '%';
                                    }
                                  },
                                  title: {
                                    display: true,
                                    text: 'Profit Margin (%)',
                                    color: '#6b7280',
                                    font: {
                                      size: 10,
                                    },
                                  },
                                },
                              },
                            }}
                          />
                          <div className="mt-2 text-xs text-gray-500">
                            <p>💡 <strong>Insight:</strong> This chart shows your profit margin trend over time compared to the target margin.
                            {getEnhancedTrendData(selectedProductForAnalytics).length > 0 && 
                              getEnhancedTrendData(selectedProductForAnalytics)[0].profitMargin > 30 ? (
                              <span className="text-green-600 font-medium"> Your current profit margin is healthy at {
                                getEnhancedTrendData(selectedProductForAnalytics)[0].profitMargin.toFixed(1)
                              }%, which is above the target of 30%.</span>
                            ) : getEnhancedTrendData(selectedProductForAnalytics).length > 0 ? (
                              <span className="text-amber-600 font-medium"> Your current profit margin is {
                                getEnhancedTrendData(selectedProductForAnalytics)[0].profitMargin.toFixed(1)
                              }%, which is below the target of 30%. Consider adjusting pricing or reducing costs.</span>
                            ) : (
                              <span> No profit margin data available.</span>
                            )}
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Sales Heatmap by Day/Hour</h3>
                    <div className="rounded-lg border bg-white p-4">
                      <div className="grid grid-cols-7 gap-1.5">
                        {/* Day headers */}
                        {getHeatmapData(selectedProductForAnalytics).days.map((day: string, index: number) => (
                          <div key={`day-${index}`} className="text-center text-xs font-medium text-gray-500">
                            {day}
                          </div>
                        ))}
                        
                        {/* Heatmap cells */}
                        {getHeatmapData(selectedProductForAnalytics).data.map((row: number[], hourIndex: number) => (
                          <Fragment key={`row-${hourIndex}`}>
                            {row.map((intensity: number, dayIndex: number) => {
                              const cellData = getHeatmapCellData(intensity);
                              
                              return (
                                <div 
                                  key={`cell-${hourIndex}-${dayIndex}`}
                                  className="relative"
                                >
                                  <div
                                    className="heatmap-cell"
                                    style={{
                                      backgroundColor: `rgba(34, 197, 94, ${intensity * 0.2})`, // Changed to green
                                      cursor: 'pointer',
                                      height: '48px',
                                      width: '100%',
                                      borderRadius: '6px',
                                      transition: 'all 0.2s ease-in-out',
                                    }}
                                  >
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="h-full w-full" />
                                        </TooltipTrigger>
                                        <TooltipContent 
                                          side="top" 
                                          sideOffset={5}
                                          align="center"
                                          className="bg-white text-gray-900 border shadow-lg p-4 w-[300px] z-[100]"
                                          avoidCollisions={true}
                                          collisionPadding={20}
                                        >
                                          <div className="space-y-3">
                                            <div className="flex items-center justify-between border-b pb-2">
                                              <div>
                                                <span className="font-semibold text-lg">{DAYS[dayIndex]}</span>
                                                <span className="text-gray-500 ml-2">{TIME_SLOTS[hourIndex]}</span>
                                              </div>
                                              <Badge variant={cellData.isHighTraffic ? 'default' : 'secondary'} className={
                                                cellData.isHighTraffic ? 'bg-green-100 text-green-800' : ''
                                              }>
                                                {cellData.isHighTraffic ? '🔥 Peak Hours' : 'Regular Hours'}
                                              </Badge>
                                            </div>
                                            <div className="space-y-2">
                                              <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Total Sales</span>
                                                <span className="font-semibold text-lg">${cellData.salesValue.toFixed(2)}</span>
                                              </div>
                                              <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Orders</span>
                                                <div className="flex items-center gap-2">
                                                  <span className="font-medium">{cellData.totalOrders}</span>
                                                  <span className="text-sm text-gray-500">orders</span>
                                                </div>
                                              </div>
                                              <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Avg. Order Value</span>
                                                <span className="font-medium">${cellData.averageOrderValue.toFixed(2)}</span>
                                              </div>
                                              <div className="flex justify-between items-center">
                                                <span className="text-gray-600">vs. Average</span>
                                                <span className={`font-medium ${
                                                  cellData.comparedToAverage > 0 
                                                    ? 'text-green-600' 
                                                    : 'text-red-600'
                                                }`}>
                                                  {cellData.comparedToAverage > 0 ? '↑' : '↓'} {Math.abs(cellData.comparedToAverage).toFixed(1)}%
                                                </span>
                                              </div>
                                            </div>
                                            {cellData.isHighTraffic && (
                                              <div className="mt-2 bg-green-50 p-2 rounded-md text-sm text-green-800">
                                                <div className="flex gap-2 items-start">
                                                  <span>💡</span>
                                                  <span>Peak selling period with {cellData.totalOrders} orders. Consider:
                                                    <ul className="list-disc ml-4 mt-1">
                                                      <li>Increasing inventory levels</li>
                                                      <li>Adding extra staff support</li>
                                                      <li>Running promotions during slower hours</li>
                                                    </ul>
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              );
                            })}
                          </Fragment>
                        ))}
                        
                        {/* Time labels */}
                        <div className="col-span-7 mt-2 grid grid-cols-6 text-xs text-gray-500">
                          {getHeatmapData(selectedProductForAnalytics).hours.map((hour: string, index: number) => (
                            <div key={`hour-${index}`} className="text-center font-medium">
                              {hour}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Summary section */}
                      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-500">Peak Hour</p>
                          <p className="mt-2 text-xl font-semibold text-gray-900">4PM</p>
                          <p className="mt-1 text-xs text-gray-500">Most active time</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-500">Busiest Day</p>
                          <p className="mt-2 text-xl font-semibold text-gray-900">Wednesday</p>
                          <p className="mt-1 text-xs text-gray-500">Highest order volume</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-500">Avg. Sales</p>
                          <p className="mt-2 text-xl font-semibold text-gray-900">
                            {Math.floor(Math.random() * 20) + 10}.{Math.floor(Math.random() * 10)}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">Per day</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }} />
                            <span>Low Sales (Less than $300)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: 'rgba(34, 197, 94, 0.5)' }} />
                            <span>Moderate ($300-$750)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }} />
                            <span>High Sales (More than $750)</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          💡 Hover over cells to see detailed sales information for each time slot
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowAnalyticsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to get heatmap colors
const getHeatmapColor = (hour: number) => {
  // Night hours (0-6) - dark blue
  if (hour >= 0 && hour < 6) {
    return '#1e40af';
  }
  // Morning hours (6-12) - light blue to green
  if (hour >= 6 && hour < 12) {
    const intensity = (hour - 6) / 6;
    return `rgba(${34 + intensity * 150}, ${197 + intensity * 58}, ${94 + intensity * 161}, 0.7)`;
  }
  // Afternoon hours (12-18) - green to orange
  if (hour >= 12 && hour < 18) {
    const intensity = (hour - 12) / 6;
    return `rgba(${34 + intensity * 215}, ${197 - intensity * 100}, ${94 - intensity * 94}, 0.7)`;
  }
  // Evening hours (18-24) - orange to purple
  return `rgba(${249 - (hour - 18) * 100}, ${115 - (hour - 18) * 50}, ${22 + (hour - 18) * 100}, 0.7)`;
}; 