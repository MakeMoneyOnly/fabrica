'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Palette,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  Save,
  Undo,
  Redo,
  Settings,
  Image,
  Type,
  Square,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// Mock store components for the builder
const STORE_COMPONENTS = [
  {
    id: 'hero',
    name: 'Hero Section',
    icon: <Image className="w-4 h-4" />,
    category: 'layout',
    description: 'Eye-catching header with title and CTA'
  },
  {
    id: 'text',
    name: 'Text Block',
    icon: <Type className="w-4 h-4" />,
    category: 'content',
    description: 'Add headings, paragraphs, and formatted text'
  },
  {
    id: 'products',
    name: 'Product Grid',
    icon: <Square className="w-4 h-4" />,
    category: 'commerce',
    description: 'Display your products in a grid layout'
  },
  {
    id: 'features',
    name: 'Features Section',
    icon: <Layout className="w-4 h-4" />,
    category: 'layout',
    description: 'Highlight key features and benefits'
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    icon: <Type className="w-4 h-4" />,
    category: 'social',
    description: 'Show customer reviews and testimonials'
  },
  {
    id: 'contact',
    name: 'Contact Form',
    icon: <Type className="w-4 h-4" />,
    category: 'interaction',
    description: 'Allow visitors to contact you'
  }
];

const THEMES = [
  {
    id: 'modern',
    name: 'Modern',
    colors: { primary: '#3B82F6', secondary: '#F1F5F9', accent: '#06B6D4' },
    preview: 'Clean and contemporary design'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    colors: { primary: '#000000', secondary: '#FFFFFF', accent: '#6B7280' },
    preview: 'Simple and elegant design'
  },
  {
    id: 'creative',
    name: 'Creative',
    colors: { primary: '#8B5CF6', secondary: '#FEF3C7', accent: '#F59E0B' },
    preview: 'Bold and artistic design'
  },
  {
    id: 'professional',
    name: 'Professional',
    colors: { primary: '#1F2937', secondary: '#F9FAFB', accent: '#059669' },
    preview: 'Business-focused design'
  }
];

export default function StoreBuilder() {
  const [selectedTheme, setSelectedTheme] = useState('modern');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/creator-dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-semibold text-gray-900">Store Builder</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Undo className="w-4 h-4 mr-2" />
                Undo
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="w-4 h-4 mr-2" />
                Redo
              </Button>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Sidebar - Components */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <Tabs defaultValue="components" className="flex-1 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="themes">Themes</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="components" className="flex-1 p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Layout Components</h3>
                  <div className="space-y-2">
                    {STORE_COMPONENTS.filter(c => c.category === 'layout').map((component) => (
                      <div
                        key={component.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedComponent === component.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedComponent(component.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            {component.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{component.name}</p>
                            <p className="text-xs text-gray-500">{component.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Content Components</h3>
                  <div className="space-y-2">
                    {STORE_COMPONENTS.filter(c => c.category === 'content').map((component) => (
                      <div
                        key={component.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedComponent === component.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedComponent(component.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            {component.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{component.name}</p>
                            <p className="text-xs text-gray-500">{component.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Commerce Components</h3>
                  <div className="space-y-2">
                    {STORE_COMPONENTS.filter(c => c.category === 'commerce').map((component) => (
                      <div
                        key={component.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedComponent === component.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedComponent(component.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            {component.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{component.name}</p>
                            <p className="text-xs text-gray-500">{component.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="themes" className="flex-1 p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Choose Theme</h3>
                  <div className="space-y-3">
                    {THEMES.map((theme) => (
                      <div
                        key={theme.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedTheme === theme.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTheme(theme.id)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex gap-1">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: theme.colors.secondary }}
                            />
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: theme.colors.accent }}
                            />
                          </div>
                          <span className="text-sm font-medium">{theme.name}</span>
                        </div>
                        <p className="text-xs text-gray-500">{theme.preview}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Custom Colors</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600">Primary Color</label>
                      <input
                        type="color"
                        className="w-full h-8 rounded border border-gray-300"
                        defaultValue="#3B82F6"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Secondary Color</label>
                      <input
                        type="color"
                        className="w-full h-8 rounded border border-gray-300"
                        defaultValue="#F1F5F9"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Accent Color</label>
                      <input
                        type="color"
                        className="w-full h-8 rounded border border-gray-300"
                        defaultValue="#06B6D4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Preview Controls */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                {previewMode === 'desktop' && 'Desktop Preview (1920px)'}
                {previewMode === 'tablet' && 'Tablet Preview (768px)'}
                {previewMode === 'mobile' && 'Mobile Preview (375px)'}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-gray-100 p-8">
            <div
              ref={canvasRef}
              className={`bg-white shadow-lg mx-auto transition-all duration-300 ${
                previewMode === 'desktop' ? 'w-full max-w-6xl' :
                previewMode === 'tablet' ? 'w-[768px]' :
                'w-[375px]'
              }`}
              style={{ minHeight: '800px' }}
            >
              {/* Mock Store Preview */}
              <div className="p-8">
                {/* Hero Section Placeholder */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-16 rounded-lg mb-8">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Welcome to My Store</h1>
                    <p className="text-xl opacity-90 mb-6">Discover amazing digital products and courses</p>
                    <Button className="bg-white text-blue-600 hover:bg-gray-100">
                      Shop Now
                    </Button>
                  </div>
                </div>

                {/* Products Grid Placeholder */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg p-6">
                        <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                          <span className="text-gray-500">Product Image</span>
                        </div>
                        <h3 className="font-semibold mb-2">Product Title {i}</h3>
                        <p className="text-gray-600 mb-4">Product description goes here...</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">ETB 2,500</span>
                          <Button size="sm">Add to Cart</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Section Placeholder */}
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-6 text-center">Why Choose My Store?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-blue-600 font-bold">✓</span>
                      </div>
                      <h3 className="font-semibold mb-2">Quality Content</h3>
                      <p className="text-gray-600">High-quality digital products you can trust</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-green-600 font-bold">✓</span>
                      </div>
                      <h3 className="font-semibold mb-2">Fast Delivery</h3>
                      <p className="text-gray-600">Instant access to your purchases</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-purple-600 font-bold">✓</span>
                      </div>
                      <h3 className="font-semibold mb-2">24/7 Support</h3>
                      <p className="text-gray-600">Always here to help you succeed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Page Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Page Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="My Amazing Store"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Meta Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    rows={3}
                    placeholder="Discover amazing digital products and courses..."
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Store Branding</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Store Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="My Store"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Logo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                    <Image className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">Click to upload logo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
