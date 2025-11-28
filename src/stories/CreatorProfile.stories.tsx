import type { Meta, StoryObj } from '@storybook/react'
import { CreatorProfile } from '@/components/storefront/CreatorProfile'

const meta = {
  title: 'Storefront/CreatorProfile',
  component: CreatorProfile,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    primaryColor: { control: 'color' },
    showVerifiedBadge: { control: 'boolean' },
  },
} satisfies Meta<typeof CreatorProfile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    fullName: 'Sarah Johnson',
    username: 'sarahjohnson',
    bio: 'Digital creator, entrepreneur, and coffee enthusiast. Helping you build your dream business online.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    socialLinks: {
      instagram: 'https://instagram.com/sarahjohnson',
      twitter: 'https://twitter.com/sarahjohnson',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      website: 'https://sarahjohnson.com',
    },
    primaryColor: '#2563eb',
    showVerifiedBadge: false,
  },
}

export const Verified: Story = {
  args: {
    ...Default.args,
    showVerifiedBadge: true,
  },
}

export const WithoutAvatar: Story = {
  args: {
    fullName: 'John Doe',
    username: 'johndoe',
    bio: 'Fitness coach and nutrition expert. Transform your body and mind.',
    socialLinks: {
      instagram: 'https://instagram.com/johndoe',
      tiktok: 'https://tiktok.com/@johndoe',
    },
    primaryColor: '#10b981',
  },
}

export const AllSocialLinks: Story = {
  args: {
    fullName: 'Alex Rivera',
    username: 'alexrivera',
    bio: 'Content creator, speaker, and tech enthusiast. Building the future, one video at a time.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    socialLinks: {
      instagram: 'https://instagram.com/alexrivera',
      twitter: 'https://twitter.com/alexrivera',
      tiktok: 'https://tiktok.com/@alexrivera',
      facebook: 'https://facebook.com/alexrivera',
      linkedin: 'https://linkedin.com/in/alexrivera',
      website: 'https://alexrivera.com',
    },
    primaryColor: '#8b5cf6',
    showVerifiedBadge: true,
  },
}

export const MinimalProfile: Story = {
  args: {
    fullName: 'Emma Wilson',
    username: 'emmawilson',
    primaryColor: '#ec4899',
  },
}

export const CustomColor: Story = {
  args: {
    fullName: 'Michael Chen',
    username: 'michaelchen',
    bio: 'Designer, developer, and digital nomad. Creating beautiful experiences.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    socialLinks: {
      twitter: 'https://twitter.com/michaelchen',
      website: 'https://michaelchen.design',
    },
    primaryColor: '#f59e0b',
  },
}
