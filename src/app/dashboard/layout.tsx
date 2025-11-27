import { HeaderWithAuth } from '@/components/layout/HeaderWithAuth'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <HeaderWithAuth />
      <main className="pt-[60px] h-[calc(100vh-60px)]">{children}</main>
    </div>
  )
}
