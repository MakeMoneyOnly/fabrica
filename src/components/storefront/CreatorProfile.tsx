'use client'

import Image from 'next/image'
import { Instagram, Twitter, Linkedin, Globe, Facebook } from 'lucide-react'
import { cn } from '@/lib/utils'

// TikTok icon component (lucide-react doesn't have it)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

export interface SocialLinks {
  instagram?: string
  twitter?: string
  tiktok?: string
  facebook?: string
  linkedin?: string
  website?: string
}

export interface CreatorProfileProps {
  fullName: string
  username: string
  bio?: string
  avatarUrl?: string
  socialLinks?: SocialLinks
  primaryColor?: string
  showVerifiedBadge?: boolean
  className?: string
}

export function CreatorProfile({
  fullName,
  username,
  bio,
  avatarUrl,
  socialLinks = {},
  primaryColor = '#2563eb',
  showVerifiedBadge = false,
  className,
}: CreatorProfileProps) {
  const initials = fullName?.charAt(0) || username.charAt(0)

  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      {/* Avatar */}
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden mb-4">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={fullName}
            width={160}
            height={160}
            className="w-full h-full object-cover"
            priority
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
            style={{ backgroundColor: primaryColor }}
          >
            {initials.toUpperCase()}
          </div>
        )}
      </div>

      {/* Name with optional verified badge */}
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
        {showVerifiedBadge && (
          <svg
            className="w-6 h-6 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      {/* Bio */}
      {bio && <p className="text-gray-600 max-w-lg mb-6 text-lg leading-relaxed">{bio}</p>}

      {/* Social Links */}
      {Object.keys(socialLinks).length > 0 && (
        <div className="flex items-center gap-4 mb-10">
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
          )}
          {socialLinks.twitter && (
            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
          )}
          {socialLinks.tiktok && (
            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-black transition-colors"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-6 h-6" />
            </a>
          )}
          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          )}
          {socialLinks.website && (
            <a
              href={socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="Website"
            >
              <Globe className="w-6 h-6" />
            </a>
          )}
        </div>
      )}
    </div>
  )
}
