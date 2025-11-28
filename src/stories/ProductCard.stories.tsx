import type { Meta, StoryObj } from '@storybook/react'
import { ProductCard } from '@/components/storefront/ProductCard'

const meta = {
  title: 'Storefront/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    primaryColor: { control: 'color' },
    type: {
      control: 'select',
      options: ['digital', 'booking', 'link'],
    },
  },
} satisfies Meta<typeof ProductCard>

export default meta
type Story = StoryObj<typeof meta>

export const DigitalProduct: Story = {
  args: {
    id: '1',
    title: 'Complete Web Development Course',
    description:
      'Learn modern web development from scratch. Build real-world projects with React, Next.js, and more.',
    price: 2500,
    currency: 'ETB',
    coverImageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    type: 'digital',
    primaryColor: '#2563eb',
  },
}

export const BookingProduct: Story = {
  args: {
    id: '2',
    title: '1-on-1 Coaching Session',
    description:
      'Get personalized guidance and strategies to grow your business. 60-minute video call.',
    price: 1500,
    currency: 'ETB',
    coverImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    type: 'booking',
    primaryColor: '#8b5cf6',
  },
}

export const ExternalLink: Story = {
  args: {
    id: '3',
    title: 'My YouTube Channel',
    description: 'Subscribe to my channel for weekly tutorials and tips on entrepreneurship.',
    price: 0,
    coverImageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    type: 'link',
    externalUrl: 'https://youtube.com/@example',
    primaryColor: '#ef4444',
  },
}

export const FreeDigitalProduct: Story = {
  args: {
    id: '4',
    title: 'Free eBook: Getting Started',
    description:
      'Download this comprehensive guide to kickstart your journey. No credit card required.',
    price: 0,
    currency: 'ETB',
    coverImageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    type: 'digital',
    primaryColor: '#10b981',
  },
}

export const WithoutImage: Story = {
  args: {
    id: '5',
    title: 'Premium Consultation',
    description: 'Expert advice tailored to your specific needs and goals.',
    price: 3000,
    currency: 'ETB',
    type: 'booking',
    primaryColor: '#f59e0b',
  },
}

export const HighPriceProduct: Story = {
  args: {
    id: '6',
    title: 'Master Class Bundle',
    description: 'Complete collection of all my courses, templates, and exclusive resources.',
    price: 15000,
    currency: 'ETB',
    coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    type: 'digital',
    primaryColor: '#ec4899',
  },
}

export const LongDescription: Story = {
  args: {
    id: '7',
    title: 'Advanced Marketing Strategies',
    description:
      'This comprehensive course covers everything you need to know about modern marketing strategies, including social media marketing, content marketing, email marketing, SEO optimization, paid advertising, analytics, and much more. Perfect for beginners and experienced marketers alike.',
    price: 4500,
    currency: 'ETB',
    coverImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    type: 'digital',
    primaryColor: '#2563eb',
  },
}
