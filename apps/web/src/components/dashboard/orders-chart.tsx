'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      bodyFont: {
        size: 12,
        family: 'Inter, sans-serif',
      },
      padding: 12,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(8px)',
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            if (context.dataset.label === 'Conversion Rate') {
              label += context.parsed.y.toFixed(1) + '%';
            } else if (context.dataset.label === 'Average Order Value') {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(context.parsed.y);
            } else {
              label += context.parsed.y;
            }
          }
          return label;
        }
      }
    },
  },
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12,
          family: 'Inter, sans-serif',
        },
      },
    },
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      grid: {
        color: 'rgba(243, 244, 246, 0.4)',
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12,
          family: 'Inter, sans-serif',
        },
      },
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 12,
          family: 'Inter, sans-serif',
        },
        callback: function(this: any, value: string | number) {
          if (typeof value === 'number') {
            return value.toFixed(1) + '%';
          }
          return value;
        }
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 2,
      hoverRadius: 6,
      borderWidth: 3,
      backgroundColor: '#ffffff',
      hoverBorderWidth: 3,
    },
  },
};

const data = {
  labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  datasets: [
    {
      label: 'Total Orders',
      data: [320, 385, 425, 390, 450, 480, 520, 550, 580, 620],
      borderColor: '#23c55e',
      backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D } }) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(74, 222, 128, 0.2)');
        gradient.addColorStop(0.5, 'rgba(74, 222, 128, 0.1)');
        gradient.addColorStop(1, 'rgba(220, 252, 231, 0)');
        return gradient;
      },
      borderWidth: 2,
      fill: true,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#23c55e',
      yAxisID: 'y',
    },
    {
      label: 'Conversion Rate',
      data: [2.8, 3.2, 3.5, 3.3, 3.8, 4.0, 4.2, 4.5, 4.8, 5.0],
      borderColor: '#a855f7',
      borderWidth: 2,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#a855f7',
      yAxisID: 'y1',
    }
  ],
};

export function OrdersChart() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeframe, setTimeframe] = useState('thisYear');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="dashboard-card p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-xl bg-gray-200"></div>
            <h2 className="text-xl font-bold text-gray-900">Sales Performance</h2>
          </div>
          <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-200" />
        </div>
        <div className="h-[400px] w-full animate-pulse rounded-2xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="dashboard-card p-8 group hover:shadow-2xl transition-all duration-300">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#4ddc82] to-[#22c55e] shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sales Performance</h2>
            <p className="text-sm text-gray-600 mt-0.5">Track your orders and conversion trends</p>
          </div>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[140px] bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80 transition-all duration-200">
            <SelectValue placeholder="This year" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-sm border-white/20">
            <SelectItem value="thisYear" className="hover:bg-gray-50/80">This year</SelectItem>
            <SelectItem value="thisMonth" className="hover:bg-gray-50/80">This month</SelectItem>
            <SelectItem value="lastMonth" className="hover:bg-gray-50/80">Last month</SelectItem>
            <SelectItem value="last6Months" className="hover:bg-gray-50/80">Last 6 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Modern Legend */}
      <div className="flex items-center justify-center gap-8 mb-8">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200/50">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#4ddc82] to-[#22c55e] shadow-sm"></div>
          <span className="text-sm font-medium text-green-800">Total Orders</span>
          <span className="text-xs text-green-600 bg-green-200/50 px-2 py-0.5 rounded-full">+12.5%</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200/50">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 shadow-sm"></div>
          <span className="text-sm font-medium text-purple-800">Conversion Rate</span>
          <span className="text-xs text-purple-600 bg-purple-200/50 px-2 py-0.5 rounded-full">+8.2%</span>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <Line options={options} data={data} />
      </div>

      {/* Bottom stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50/50 to-green-100/30 border border-green-200/30">
          <div className="text-2xl font-bold text-green-700">620</div>
          <div className="text-sm text-green-600">Latest Orders</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-purple-100/30 border border-purple-200/30">
          <div className="text-2xl font-bold text-purple-700">5.0%</div>
          <div className="text-sm text-purple-600">Peak Conversion</div>
        </div>
      </div>
    </div>
  );
}