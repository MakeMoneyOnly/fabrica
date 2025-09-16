'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Papa, { ParseResult } from 'papaparse';
import { Upload } from 'lucide-react';

interface CSVProduct {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  stock?: string;
  image?: string;
  [key: string]: string | undefined;
}

interface CSVImportProps {
  onImportSuccess: (products: CSVProduct[]) => void;
}

export function CSVImport({ onImportSuccess }: CSVImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Smart field mapping for common CSV headers
  const mapFieldName = (header: string): string => {
    header = header.toLowerCase().trim();
    
    // Map common name variations
    if (header.includes('name') || header.includes('title') || header.includes('product')) return 'name';
    
    // Map common price variations
    if (header.includes('price') || header.includes('cost') || header.includes('amount')) return 'price';
    
    // Map common category variations
    if (header.includes('category') || header.includes('type') || header.includes('group')) return 'category';
    
    // Map common stock variations
    if (header.includes('stock') || header.includes('quantity') || header.includes('qty') || header.includes('inventory')) return 'stock';
    
    // Map common description variations
    if (header.includes('description') || header.includes('desc') || header.includes('details')) return 'description';
    
    // Map common image variations
    if (header.includes('image') || header.includes('img') || header.includes('photo') || header.includes('picture') || header.includes('url')) return 'image';
    
    return header;
  };

  const processFile = (file: File) => {
    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<CSVProduct>) => {
        // Map headers to our expected fields
        const mappedData = results.data.map(row => {
          const mappedRow: CSVProduct = {
            name: '',
            price: '',
            category: '',
            stock: '',
            description: '',
            image: ''
          };
          
          // First pass: map known fields
          Object.entries(row).forEach(([key, value]) => {
            const mappedKey = mapFieldName(key);
            if (mappedKey in mappedRow && value) {
              // Clean up the value based on field type
              if (mappedKey === 'price') {
                // Remove currency symbols and non-numeric characters except dots
                const numericValue = value.replace(/[^0-9.]/g, '');
                mappedRow[mappedKey] = numericValue;
              } else if (mappedKey === 'category') {
                // Capitalize first letter of each word
                mappedRow[mappedKey] = value
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ')
                  .trim();
              } else if (mappedKey === 'image') {
                const trimmedValue = value.trim();
                // Handle various image URL formats
                if (trimmedValue) {
                  // Check if it's a valid URL
                  if (trimmedValue.match(/^https?:\/\//i) || 
                      trimmedValue.match(/^www\./i) || 
                      trimmedValue.match(/^data:image\//i)) {
                    // Ensure it has a proper protocol
                    if (trimmedValue.match(/^www\./i)) {
                      mappedRow[mappedKey] = `https://${trimmedValue}`;
                    } else {
                      mappedRow[mappedKey] = trimmedValue;
                    }
                  } 
                  // Otherwise, store it as is
                  else {
                    mappedRow[mappedKey] = trimmedValue;
                  }
                }
              } else {
                mappedRow[mappedKey] = value.trim();
              }
            }
          });

          // Second pass: try to find values for empty fields using alternative headers
          if (!mappedRow.name) {
            const productField = Object.entries(row).find(([key]) => 
              key.toLowerCase().includes('product') || key.toLowerCase().includes('item')
            );
            if (productField?.[1]) mappedRow.name = productField[1].trim();
          }

          if (!mappedRow.price) {
            const priceField = Object.entries(row).find(([key]) => 
              key.toLowerCase().includes('price') || key.toLowerCase().includes('cost') || 
              key.toLowerCase().includes('amount') || key.toLowerCase().includes('value')
            );
            if (priceField?.[1]) {
              const numericValue = priceField[1].replace(/[^0-9.]/g, '');
              mappedRow.price = numericValue;
            }
          }

          if (!mappedRow.category) {
            const categoryField = Object.entries(row).find(([key]) => 
              key.toLowerCase().includes('category') || key.toLowerCase().includes('type') || 
              key.toLowerCase().includes('group') || key.toLowerCase().includes('department')
            );
            if (categoryField?.[1]) {
              mappedRow.category = categoryField[1]
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
                .trim();
            }
          }

          if (!mappedRow.stock) {
            const stockField = Object.entries(row).find(([key]) => 
              key.toLowerCase().includes('stock') || key.toLowerCase().includes('quantity') || 
              key.toLowerCase().includes('qty') || key.toLowerCase().includes('inventory') ||
              key.toLowerCase().includes('available')
            );
            if (stockField?.[1]) {
              const numericValue = stockField[1].replace(/[^0-9]/g, '');
              mappedRow.stock = numericValue;
            }
          }

          // Add image field to second pass
          if (!mappedRow.image) {
            const imageField = Object.entries(row).find(([key]) => 
              key.toLowerCase().includes('image') || key.toLowerCase().includes('img') || 
              key.toLowerCase().includes('photo') || key.toLowerCase().includes('picture') ||
              key.toLowerCase().includes('url')
            );
            if (imageField?.[1]) {
              const trimmedValue = imageField[1].trim();
              if (trimmedValue) {
                // Check if it's a valid URL
                if (trimmedValue.match(/^https?:\/\//i) || 
                    trimmedValue.match(/^www\./i) || 
                    trimmedValue.match(/^data:image\//i)) {
                  // Ensure it has a proper protocol
                  if (trimmedValue.match(/^www\./i)) {
                    mappedRow.image = `https://${trimmedValue}`;
                  } else {
                    mappedRow.image = trimmedValue;
                  }
                } 
                // Otherwise, store it as is
                else {
                  mappedRow.image = trimmedValue;
                }
              }
            }
          }

          return mappedRow;
        });

        // Filter out empty rows and rows without required fields
        const validData = mappedData.filter(row => 
          row.name && row.name.trim() !== '' &&
          (!row.price || !isNaN(parseFloat(row.price))) &&
          (!row.stock || !isNaN(parseInt(row.stock)))
        );

        if (validData.length === 0) {
          toast({
            title: "No Valid Data",
            description: "No valid product data found in the file. Please ensure your file contains at least product names and valid price/stock values.",
            variant: "destructive",
          });
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          onImportSuccess(validData);
          setIsOpen(false);
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          toast({
            title: "Import Successful",
            description: `Successfully imported ${validData.length} products.`,
          });
        }
        setIsProcessing(false);
      },
      error: (error: Error) => {
        toast({
          title: "Import Error",
          description: "Failed to parse CSV file. Please check the file format.",
          variant: "destructive",
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setIsProcessing(false);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      processFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      processFile(file);
    }
  };

  // Add dialog close handler to reset state
  const handleDialogClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#4ddc82] hover:bg-[#4ddc82]/90 text-black">
          <Upload className="mr-2 h-4 w-4" />
          Import Products
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Products</DialogTitle>
          <DialogDescription>
            Upload a CSV file with your product data. The importer will automatically match common field names.
            Any missing information or images can be added after import.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv"
              onChange={handleFileSelect}
            />
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                {isProcessing ? (
                  "Processing file..."
                ) : selectedFile ? (
                  `Selected: ${selectedFile.name}`
                ) : (
                  <>
                    <p>Drag and drop your CSV file here, or</p>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      click to browse
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <p className="font-medium">Supported Fields:</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Product Name (name, title, product)</li>
              <li>Price (price, cost, amount)</li>
              <li>Category (category, type, group)</li>
              <li>Stock (stock, quantity, qty, inventory)</li>
              <li>Description (description, desc, details)</li>
              <li>Image (image, img, photo, picture, url)</li>
            </ul>
            
            <p className="mt-2">Don't worry if your CSV has missing fields or images - you can add or edit information after import. For products without images, you'll be prompted to upload them after import.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!selectedFile || isProcessing}
            onClick={() => selectedFile && processFile(selectedFile)}
          >
            {isProcessing ? "Processing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 