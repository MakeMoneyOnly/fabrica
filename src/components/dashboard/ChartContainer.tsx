'use client'

import { cn } from '@/lib/utils'
import { ResponsiveContainer } from 'recharts'

interface ChartContainerProps {
  title: string
  description?: string
  children: React.ReactElement
  className?: string
  height?: number | string
}

export function ChartContainer({
  title,
  description,
  children,
  className,
  height = 350,
}: ChartContainerProps) {
  return (
    <div className={cn('p-6 bg-white rounded-2xl shadow-sm border border-gray-100', className)}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div style={{ height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
