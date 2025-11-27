import { HeroSection } from '@/components/ui/hero-section'
import { StatsSection } from '@/components/ui/stats-section'
import { ImageCarousel } from '@/components/ui/image-carousel'
import { Header } from '@/components/layout/Header'
import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth'
import { isClerkConfigured } from '@/lib/utils/clerk'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  // Check authentication status
  const { userId } = await auth()

  // If user is already signed in, redirect to onboarding
  // The onboarding page will handle redirecting to dashboard if already completed
  if (userId) {
    redirect('/onboarding')
  }

  const clerkConfigured = isClerkConfigured()

  const demoImages = [
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1684369176170-463e84248b70?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFpfGVufDB8MXwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900',
      alt: 'Mountain landscape',
      rotation: -15,
    },
    {
      id: '2',
      src: 'https://plus.unsplash.com/premium_photo-1677269465314-d5d2247a0b0c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGFpfGVufDB8MXwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900',
      alt: 'Abstract art',
      rotation: -8,
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1524673360092-e07b7ae58845?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGFpfGVufDB8MXwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900',
      alt: 'City skyline',
      rotation: 5,
    },
    {
      id: '4',
      src: 'https://plus.unsplash.com/premium_photo-1680610653084-6e4886519caf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGFpfGVufDB8MXwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900',
      alt: 'Nature photography',
      rotation: 12,
    },
    {
      id: '5',
      src: 'https://plus.unsplash.com/premium_photo-1680608979589-e9349ed066d5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8QWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900',
      alt: 'Digital art',
      rotation: -12,
    },
    {
      id: '6',
      src: 'https://images.unsplash.com/photo-1562575214-da9fcf59b907?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGFpfGVufDB8MXwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900',
      alt: 'Tropical leaves',
      rotation: 8,
    },
    {
      id: '7',
      src: 'https://plus.unsplash.com/premium_photo-1676637656210-390da73f4951?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGFpfGVufDB8MXwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900',
      alt: 'Tropical leaves',
      rotation: 8,
    },
    {
      id: '8',
      src: 'https://images.unsplash.com/photo-1664448003794-2d446c53dcae?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fGFpfGVufDB8MXwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=900',
      alt: 'Tropical leaves',
      rotation: 8,
    },
  ]

  return (
    <main className="min-h-screen bg-[#F5F5F7] w-full overflow-x-hidden">
      {clerkConfigured ? <HeaderWithAuth /> : <Header />}
      <HeroSection />
      <div data-scroll-section>
        <StatsSection />
      </div>
      <div data-scroll-section>
        <ImageCarousel images={demoImages} />
      </div>
    </main>
  )
}
