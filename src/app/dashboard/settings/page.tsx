'use client'

import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { User, Store, CreditCard, Bell, Shield, Save, Upload, Check, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'storefront', label: 'Storefront', icon: Store },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
]

export default function SettingsPage() {
  const { userId, isLoaded } = useAuth()
  const { user: clerkUser } = useUser()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    async function fetchUserData() {
      if (!isLoaded || !userId) return

      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_user_id', userId)
          .single()

        if (data) {
          setUserData(data)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isLoaded, userId])

  const handleSaveProfile = async () => {
    if (!userId || !userData) return

    setSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: userData.full_name,
          bio: userData.bio,
          avatar_url: userData.avatar_url,
        }),
      })

      if (!response.ok) throw new Error('Failed to update profile')

      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all',
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <tab.icon
                  className={cn(
                    'w-5 h-5 mr-3',
                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                  )}
                />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8"
            >
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </button>
                  </div>

                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl font-bold overflow-hidden">
                      {userData?.avatar_url ? (
                        <img
                          src={userData.avatar_url}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        userData?.full_name?.charAt(0) || 'U'
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Profile Photo</h3>
                      <p className="text-xs text-gray-500 mt-1 mb-3">Recommended size: 400x400px</p>
                      <button className="flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        <Upload className="w-3 h-3 mr-2" />
                        Upload New
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        value={userData?.full_name || ''}
                        onChange={(e) => setUserData({ ...userData, full_name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={userData?.email || ''}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500">
                        Email is managed by your account provider
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        rows={4}
                        value={userData?.bio || ''}
                        onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                        maxLength={160}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                      />
                      <p className="text-xs text-gray-500 text-right">
                        {userData?.bio?.length || 0}/160 characters
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'storefront' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Storefront Customization</h2>
                  <p className="text-gray-500">
                    Customize your storefront appearance in the{' '}
                    <a href="/dashboard/store-editor" className="text-blue-600 hover:underline">
                      Store Editor
                    </a>
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Store URL</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                          fabrica.et/
                        </span>
                        <input
                          type="text"
                          value={userData?.username || ''}
                          disabled
                          className="flex-1 px-4 py-2 rounded-r-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Username cannot be changed after registration
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Payment Settings</h2>

                  {userData?.telebirr_verified ? (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <CreditCard className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-900">Payment Account Connected</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Your Telebirr account ({userData.telebirr_account}) is connected and ready
                          to receive payments.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                      <h3 className="font-medium text-yellow-900">No Payment Account Connected</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Connect your Telebirr account to start receiving payments.
                      </p>
                      <button className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                        Connect Account
                      </button>
                    </div>
                  )}
                </div>
              )}

              {(activeTab === 'notifications' || activeTab === 'security') && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    {activeTab === 'notifications' ? (
                      <Bell className="w-8 h-8 text-gray-400" />
                    ) : (
                      <Shield className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
                  <p className="text-gray-500">This section is under development.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
