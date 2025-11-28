'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { createClient } from '@/lib/supabase/client'
import { Palette, Layout, Globe, Save, Loader2, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

const themes = [
  { id: 'modern', name: 'Modern', description: 'Clean and minimalist' },
  { id: 'bold', name: 'Bold', description: 'High contrast and impactful' },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated and refined' },
]

const colors = [
  { id: '#2563eb', name: 'Blue' },
  { id: '#7c3aed', name: 'Purple' },
  { id: '#db2777', name: 'Pink' },
  { id: '#059669', name: 'Green' },
  { id: '#d97706', name: 'Amber' },
  { id: '#1f2937', name: 'Dark' },
]

export default function StoreEditorPage() {
  const { userId, isLoaded } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function fetchSettings() {
      if (!isLoaded || !userId) {
        return
      }

      try {
        const supabase = createClient()

        // Get user UUID and username from Clerk ID
        const { data: user } = await supabase
          .from('users')
          .select('id, username')
          .eq('clerk_user_id', userId)
          .single()

        if (!user) {
          setLoading(false)
          return
        }

        setUser(user)

        // Get settings
        const { data: currentSettings } = await supabase
          .from('storefront_settings')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (currentSettings) {
          setSettings(currentSettings)
        } else {
          // Default settings if none exist
          setSettings({
            theme_name: 'modern',
            primary_color: '#2563eb',
            seo_title: '',
            seo_description: '',
          })
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [isLoaded, userId])

  const handleSave = async () => {
    if (!userId) {
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()

      // Get user UUID from Clerk ID
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_user_id', userId)
        .single()

      if (!user) {
        toast.error('User not found')
        return
      }

      const { error } = await supabase.from('storefront_settings').upsert({
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }
      toast.success('Store settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Editor</h1>
          <p className="text-gray-500">Customize the look and feel of your storefront.</p>
        </div>
        <div className="flex items-center gap-3">
          {user?.username && (
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview Store
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preview Area (Mock) */}
        <div className="lg:col-span-2 bg-gray-100 rounded-2xl border border-gray-200 p-8 flex items-center justify-center min-h-[400px]">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transform scale-90 md:scale-100 transition-transform">
            {/* Mock Store Header */}
            <div className="h-32 bg-gray-50 relative">
              <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundColor: settings.primary_color }}
              />
              <div className="absolute -bottom-8 left-6">
                <div className="w-20 h-20 rounded-full bg-white p-1 shadow-sm">
                  <div className="w-full h-full rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
            <div className="pt-10 px-6 pb-6">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-48 bg-gray-100 rounded mb-6" />

              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-gray-50 rounded-lg border border-gray-100" />
                <div className="aspect-square bg-gray-50 rounded-lg border border-gray-100" />
              </div>

              <div
                className="mt-6 w-full py-2 rounded-lg text-white text-center text-sm font-medium"
                style={{ backgroundColor: settings.primary_color }}
              >
                Subscribe
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Layout className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Theme</h3>
            </div>
            <div className="space-y-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSettings({ ...settings, theme_name: theme.id })}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    settings.theme_name === theme.id
                      ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{theme.name}</div>
                  <div className="text-xs text-gray-500">{theme.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Accent Color</h3>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSettings({ ...settings, primary_color: color.id })}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
                  style={{ backgroundColor: color.id }}
                >
                  {settings.primary_color === color.id && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">SEO Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={settings.seo_title || ''}
                  onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                  placeholder="My Awesome Store"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={settings.seo_description || ''}
                  onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                  placeholder="Welcome to my digital store..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
