'use client'

import { cn } from '@/lib/utils'

interface DataTableProps<T> {
  columns: {
    header: string
    accessorKey?: keyof T
    cell?: (item: T) => React.ReactNode
    className?: string
  }[]
  data: T[]
  onRowClick?: (item: T) => void
  className?: string
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        'overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={cn('px-6 py-4 font-medium', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    'group transition-colors',
                    onRowClick ? 'cursor-pointer hover:bg-gray-50/50' : ''
                  )}
                >
                  {columns.map((col, idx) => (
                    <td key={idx} className="px-6 py-4">
                      {col.cell
                        ? col.cell(item)
                        : (item[col.accessorKey as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
