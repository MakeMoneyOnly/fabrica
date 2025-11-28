'use client'

import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { DataTable } from '@/components/dashboard/DataTable'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { Users, DollarSign, Copy, Share2, TrendingUp, Award, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

export default function ReferralsPage() {
  const { userId, isLoaded } = useAuth()
  const { user: _clerkUser } = useUser()
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [referrals, setReferrals] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeReferrals: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    async function fetchReferralData() {
      if (!isLoaded || !userId) {
        return
      }

      try {
        const supabase = createClient()

        // Get user UUID and referral code
        const { data: user } = await supabase
          .from('users')
          .select('id, referral_code, username')
          .eq('clerk_user_id', userId)
          .single()

        if (!user) {
          setLoading(false)
          return
        }

        setReferralCode(user.referral_code)

        // Get referrals
        const { data: referralData } = await supabase
          .from('referrals')
          .select(
            `
            *,
            referred_user:users!referrals_referred_user_id_fkey(
              full_name,
              subscription_plan,
              created_at
            )
          `
          )
          .eq('referrer_id', user.id)
          .order('created_at', { ascending: false })

        const totalEarnings =
          referralData?.reduce((sum, ref) => sum + (ref.total_earned || 0), 0) || 0
        const activeCount = referralData?.filter((ref) => ref.status === 'active').length || 0

        setStats({
          totalEarnings,
          activeReferrals: activeCount,
          conversionRate: 0, // TODO: Calculate from analytics
        })

        setReferrals(referralData || [])
      } catch (error) {
        console.error('Error fetching referral data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferralData()
  }, [isLoaded, userId])

  const referralLink = referralCode ? `fabrica.et/ref/${referralCode}` : 'Loading...'

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${referralLink}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const columns = [
    {
      header: 'Referred User',
      accessorKey: 'referred_user.full_name',
      className: 'font-medium text-gray-900',
      cell: (item: any) => item.referred_user?.full_name || 'Unknown',
    },
    {
      header: 'Plan',
      accessorKey: 'referred_user.subscription_plan',
      cell: (item: any) => {
        const plan = item.referred_user?.subscription_plan || 'trial'
        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
              plan === 'creator_pro' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
            }`}
          >
            {plan.replace('_', ' ')}
          </span>
        )
      },
    },
    {
      header: 'Date Joined',
      accessorKey: 'created_at',
      className: 'text-gray-500',
      cell: (item: any) => format(new Date(item.created_at), 'MMM d, yyyy'),
    },
    {
      header: 'Status',
      cell: (item: any) => (
        <StatusBadge status={item.status} type={item.status === 'active' ? 'success' : 'error'} />
      ),
    },
    {
      header: 'Total Earnings',
      accessorKey: 'total_earned',
      className: 'font-medium text-green-600 text-right',
      cell: (item: any) => `ETB ${(item.total_earned || 0).toLocaleString()}`,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
          <p className="text-gray-500">
            Earn 20% recurring commission for every creator you refer.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
          <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-sm font-medium text-gray-600 font-mono">
            {referralLink}
          </div>
          <button
            onClick={copyLink}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors relative"
          >
            {copied ? (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                Copied!
              </span>
            ) : null}
            <Copy className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Earnings"
          value={`ETB ${stats.totalEarnings.toLocaleString()}`}
          icon={DollarSign}
          description="All-time earnings"
        />
        <StatsCard
          title="Active Referrals"
          value={stats.activeReferrals.toString()}
          icon={Users}
          description="Creators currently subscribed"
        />
        <StatsCard
          title="Conversion Rate"
          value="Coming Soon"
          icon={TrendingUp}
          description="Clicks to signups"
        />
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-yellow-300" />
            <h2 className="text-xl font-bold">Become a Fabrica Ambassador</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h3 className="font-semibold mb-1">Share Your Link</h3>
              <p className="text-blue-100 text-sm">
                Share your unique link on social media, YouTube, or your blog.
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h3 className="font-semibold mb-1">Creators Join</h3>
              <p className="text-blue-100 text-sm">
                When they sign up and upgrade to a paid plan, you get credit.
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h3 className="font-semibold mb-1">Earn Recurring Income</h3>
              <p className="text-blue-100 text-sm">
                Get 20% of their subscription fee every single month.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Referrals Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Referrals</h3>
        {referrals.length > 0 ? (
          <DataTable columns={columns} data={referrals} />
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No referrals yet</h3>
            <p className="text-gray-500 mb-6">
              Share your referral link to start earning commissions!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
