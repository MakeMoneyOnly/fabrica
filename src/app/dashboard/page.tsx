'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Type,
  Calendar,
  List,
  Image as ImageIcon,
  Link as LinkIcon,
  MapPin,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  MoreHorizontal,
  Plus,
  Undo,
  Redo,
  Eye,
  Smartphone,
  Monitor,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('design')

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#F9FAFB]">
      {/* LEFT COLUMN - Add Blocks */}
      <div className="w-[320px] flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto h-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Add Blocks</h2>
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Block Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <BlockButton icon={Type} label="Text" color="bg-indigo-500" />
          <BlockButton icon={Calendar} label="Calendar" />
          <BlockButton icon={List} label="Booking List" />
          <BlockButton icon={ImageIcon} label="Image" />
          <BlockButton icon={MoreHorizontal} label="Button" />
          <BlockButton icon={LinkIcon} label="Link" />
          <BlockButton icon={MapPin} label="Map" />
          <BlockButton icon={Mail} label="Newsletter" />
        </div>

        <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium mb-8 hover:bg-indigo-700 transition-colors">
          See Another Blocks
        </button>

        {/* Social Media Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Social Media</h3>
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-3">
            <SocialItem icon={Instagram} label="instagram.com/rockagency" color="text-pink-600" />
            <SocialItem icon={Facebook} label="facebook.com/rockagency" color="text-blue-600" />
            <SocialItem icon={Youtube} label="youtube.com/rockagency" color="text-red-600" />
            <SocialItem icon={Linkedin} label="linkedin.com/in/rockagency" color="text-blue-700" />
          </div>
        </div>
      </div>

      {/* CENTER COLUMN - Phone Preview */}
      <div className="flex-1 flex flex-col bg-[#F9FAFB] relative">
        {/* Toolbar */}
        <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button className="p-2 bg-white shadow-sm rounded-md text-indigo-600">
                <Smartphone className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-900">
                <Monitor className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-gray-500">
              Size
              <br />
              <span className="font-medium text-gray-900">375 x 812</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-600">
            <span>https://fabrica.et/rockagency</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
                <Undo className="w-4 h-4" /> Undo
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
                <Redo className="w-4 h-4" /> Redo
              </button>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
              <Eye className="w-4 h-4" /> Publish
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          <div className="relative w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl border-[8px] border-gray-900 overflow-hidden">
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-gray-900 rounded-b-[20px] z-20"></div>

            {/* Phone Content - Iframe or Component */}
            <div className="w-full h-full bg-white overflow-y-auto pt-12 pb-8 px-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-bold">SmartBio</div>
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              </div>

              {/* Profile */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-xl font-bold mb-1">Rock Agency</h1>
                <p className="text-center text-sm text-gray-500">
                  Rock Agency is a digital agency company and website studio specializing in
                  products.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <Facebook className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <Linkedin className="w-5 h-5" />
                </div>
              </div>

              {/* Map Block */}
              <div className="w-full h-48 bg-gray-100 rounded-2xl mb-4 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full">
                  See Our Location
                </div>
              </div>

              {/* Link Block */}
              <div className="w-full bg-gray-900 text-white p-4 rounded-2xl flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">Visit our website</span>
                </div>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Customization */}
      <div className="w-[340px] flex-shrink-0 border-l border-gray-200 bg-white overflow-y-auto h-full p-6">
        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-full mb-8">
          {['Design', 'Analytics', 'Settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={cn(
                'flex-1 py-1.5 text-sm font-medium rounded-full transition-all',
                activeTab === tab.toLowerCase()
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* AI Generator */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-gray-900">AI Generator</h3>
            <span className="text-gray-400 text-xs">ⓘ</span>
          </div>
          <div className="p-4 border border-gray-200 rounded-xl mb-3">
            <p className="text-sm text-gray-500">A linkbio profile for an agency company</p>
          </div>
          <button className="w-full py-3 bg-indigo-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors">
            <Sparkles className="w-4 h-4" /> Generate BioLink with AI
          </button>
        </div>

        {/* Themes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Select Theme</h3>
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <Minus className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button className="px-4 py-1.5 bg-gray-100 rounded-full text-sm font-medium">
              All
            </button>
            <button className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium shadow-sm">
              Light
            </button>
            <button className="px-4 py-1.5 bg-gray-100 rounded-full text-sm font-medium">
              Dark
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ThemeCard color="bg-gradient-to-br from-blue-500 to-purple-600" />
            <ThemeCard color="bg-gradient-to-br from-pink-300 to-rose-400" />
            <ThemeCard color="bg-gradient-to-br from-emerald-300 to-teal-500" />
            <ThemeCard color="bg-gradient-to-br from-slate-800 to-black" />
          </div>

          <button className="text-indigo-600 text-sm font-medium mt-3">See All Theme</button>
        </div>

        {/* Typography */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Typography</h3>
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <Minus className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Font Weight</label>
              <div className="p-2 border border-gray-200 rounded-lg text-sm font-medium flex justify-between items-center">
                SemiBold <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Font Style</label>
              <div className="flex gap-2">
                <button className="p-2 border border-gray-200 rounded-lg flex-1 flex justify-center">
                  <Italic className="w-4 h-4" />
                </button>
                <button className="p-2 border border-gray-200 rounded-lg flex-1 flex justify-center">
                  <Underline className="w-4 h-4" />
                </button>
                <button className="p-2 border border-gray-200 rounded-lg flex-1 flex justify-center">
                  <Strikethrough className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BlockButton({ icon: Icon, label, color }: { icon: any; label: string; color?: string }) {
  return (
    <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-2xl hover:border-indigo-500 hover:shadow-sm transition-all bg-white h-28">
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white',
          color || 'bg-gray-500'
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </button>
  )
}

function SocialItem({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg group cursor-pointer">
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-white',
          color
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm text-gray-600 truncate flex-1">{label}</span>
      <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

function ThemeCard({ color }: { color: string }) {
  return (
    <div className="aspect-square rounded-2xl border border-gray-200 p-2 cursor-pointer hover:border-indigo-500 transition-all">
      <div className={cn('w-full h-2/3 rounded-xl mb-2', color)}></div>
      <div className="flex gap-1">
        <div className="w-1/3 h-2 bg-gray-200 rounded-full"></div>
        <div className="w-1/3 h-2 bg-gray-200 rounded-full"></div>
        <div className="w-1/3 h-2 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  )
}

import {
  ArrowUpRight,
  Sparkles,
  Minus,
  ChevronDown,
  Italic,
  Underline,
  Strikethrough,
  Trash2,
} from 'lucide-react'
