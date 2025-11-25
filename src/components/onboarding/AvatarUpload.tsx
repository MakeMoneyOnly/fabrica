'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'

interface AvatarUploadProps {
  value: string | undefined
  onChange: (url: string | undefined) => void
  className?: string
}

export function AvatarUpload({ value, onChange, className }: AvatarUploadProps) {
  const { user } = useUser()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const supabase = await createClient()

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        setError('Failed to upload image')
        return
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('user-uploads').getPublicUrl(filePath)

      onChange(publicUrl)
    } catch (err) {
      console.error('Error uploading avatar:', err)
      setError('An error occurred while uploading')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative">
        {/* Avatar preview */}
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
          {value ? (
            <Image src={value} alt="Avatar" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              <Upload className="h-8 w-8" />
            </div>
          )}
        </div>

        {/* Remove button */}
        {value && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Loading overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>

      {/* Upload button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        >
          {value ? 'Change Photo' : 'Upload Photo'}
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Helper text */}
      <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 5MB.</p>
    </div>
  )
}
