'use client'

import { cn } from '@/lib/utils'
import { ArrowDownRight, ArrowUpRight, LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        {trend && (
          <div
            className={cn(
              'flex items-center px-2 py-1 text-xs font-medium rounded-full',
              trend.isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
            )}
          >
            {trend.isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-1" />
            )}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
      </div>
    </div>
  )
}
