import type { Meta, StoryObj } from '@storybook/react'
import { ProductList } from '@/components/storefront/ProductList'

const meta = {
  title: 'Storefront/ProductList',
  component: ProductList,
  parameters: {
    layout: 'fullscreen',
    padding: '2rem',
  },
  tags: ['autodocs'],
  argTypes: {
    primaryColor: { control: 'color' },
    defaultLayout: {
      control: 'select',
      options: ['grid', 'list'],
    },
  },
} satisfies Meta<typeof ProductList>

export default meta
type Story = StoryObj<typeof meta>

const sampleProducts = [
  {
    id: '1',
    title: 'Complete Web Development Course',
    description: 'Learn modern web development from scratch. Build real-world projects.',
    price: 2500,
    currency: 'ETB',
    coverImageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    type: 'digital' as const,
  },
  {
    id: '2',
    title: '1-on-1 Coaching Session',
    description: 'Get personalized guidance and strategies to grow your business.',
    price: 1500,
    currency: 'ETB',
    coverImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    type: 'booking' as const,
  },
  {
    id: '3',
    title: 'My YouTube Channel',
    description: 'Subscribe to my channel for weekly tutorials and tips.',
    price: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    type: 'link' as const,
    externalUrl: 'https://youtube.com/@example',
  },
  {
    id: '4',
    title: 'Free eBook: Getting Started',
    description: 'Download this comprehensive guide to kickstart your journey.',
    price: 0,
    currency: 'ETB',
    coverImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    type: 'digital' as const,
  },
  {
    id: '5',
    title: 'Premium Consultation',
    description: 'Expert advice tailored to your specific needs and goals.',
    price: 3000,
    currency: 'ETB',
    coverImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
    type: 'booking' as const,
  },
  {
    id: '6',
    title: 'Master Class Bundle',
    description: 'Complete collection of all my courses, templates, and resources.',
    price: 15000,
    currency: 'ETB',
    coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    type: 'digital' as const,
  },
]

export const GridLayout: Story = {
  args: {
    products: sampleProducts,
    primaryColor: '#2563eb',
    defaultLayout: 'grid',
    showControls: true,
  },
}

export const ListLayout: Story = {
  args: {
    products: sampleProducts,
    primaryColor: '#2563eb',
    defaultLayout: 'list',
    showControls: true,
  },
}

export const WithoutControls: Story = {
  args: {
    products: sampleProducts,
    primaryColor: '#8b5cf6',
    defaultLayout: 'grid',
    showControls: false,
  },
}

export const FewProducts: Story = {
  args: {
    products: sampleProducts.slice(0, 3),
    primaryColor: '#10b981',
    defaultLayout: 'grid',
    showControls: true,
  },
}

export const EmptyState: Story = {
  args: {
    products: [],
    primaryColor: '#2563eb',
    defaultLayout: 'grid',
    showControls: true,
  },
}

export const ManyProducts: Story = {
  args: {
    products: [
      ...sampleProducts,
      ...sampleProducts.map((p, i) => ({ ...p, id: `${p.id}-${i}` })),
      ...sampleProducts.map((p, i) => ({ ...p, id: `${p.id}-${i}-2` })),
    ],
    primaryColor: '#ec4899',
    defaultLayout: 'grid',
    showControls: true,
  },
}
