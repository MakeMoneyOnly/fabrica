'use client'

import { useState } from 'react'
import { Twitter, Facebook, Linkedin, MessageCircle, Send, Link2, Check } from 'lucide-react'
import {
  generateShareUrl,
  isWebShareSupported,
  nativeShare,
  copyToClipboard,
} from '@/lib/social/social'
import { cn } from '@/lib/utils'

export interface SocialShareProps {
  url: string
  title: string
  description?: string
  className?: string
}

export function SocialShare({ url, title, description, className }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const shareData = { url, title, description }

  const handleNativeShare = async () => {
    setIsSharing(true)
    const success = await nativeShare({ url, title, text: description })
    setIsSharing(false)
    return success
  }

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareButtons = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-blue-50 hover:text-blue-600',
      url: generateShareUrl('twitter', shareData),
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-50 hover:text-blue-700',
      url: generateShareUrl('facebook', shareData),
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-blue-50 hover:text-blue-800',
      url: generateShareUrl('linkedin', shareData),
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-green-50 hover:text-green-600',
      url: generateShareUrl('whatsapp', shareData),
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'hover:bg-blue-50 hover:text-blue-500',
      url: generateShareUrl('telegram', shareData),
    },
  ]

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium">Share:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Social Share Buttons */}
        {shareButtons.map((button) => (
          <a
            key={button.name}
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('p-2 rounded-lg border border-gray-200 transition-colors', button.color)}
            aria-label={`Share on ${button.name}`}
          >
            <button.icon className="w-5 h-5" />
          </a>
        ))}

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className={cn(
            'p-2 rounded-lg border border-gray-200 transition-colors',
            copied
              ? 'bg-green-50 text-green-600 border-green-200'
              : 'hover:bg-gray-50 hover:text-gray-900'
          )}
          aria-label="Copy link"
        >
          {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
        </button>

        {/* Native Share Button (mobile) */}
        {isWebShareSupported() && (
          <button
            onClick={handleNativeShare}
            disabled={isSharing}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isSharing ? 'Sharing...' : 'More'}
          </button>
        )}
      </div>

      {copied && (
        <p className="text-sm text-green-600 animate-fade-in">Link copied to clipboard!</p>
      )}
    </div>
  )
}
