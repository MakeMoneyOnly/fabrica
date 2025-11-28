import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
