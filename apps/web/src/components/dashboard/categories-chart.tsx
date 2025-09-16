'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 20,
      bottom: 20
    }
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#4b5563',
        font: {
          size: 12,
          family: 'Inter, sans-serif',
        },
        padding: 20,
        usePointStyle: true,
        boxWidth: 8,
      },
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
    },
  },
  scales: {
    r: {
      ticks: {
        display: false,
      },
      grid: {
        color: 'rgba(0,0,0,0.03)',
      },
      angleLines: {
        color: 'rgba(0,0,0,0.03)',
      },
      pointLabels: {
        font: {
          size: 12,
          family: 'Inter, sans-serif',
        },
        color: '#6b7280',
        padding: 10,
      },
    },
  },
};

const data = {
  labels: ['Dresses', 'Accessories', 'Shoes', 'Bags', 'Jewelry'],
  datasets: [
    {
      data: [45, 25, 20, 15, 12],
      backgroundColor: [
        '#23c55e',
        '#4ade80',
        '#86efac',
        '#bbf7d0',
        '#dcfce7',
      ],
      borderWidth: 0,
    },
  ],
};

export function CategoriesChart() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeframe, setTimeframe] = useState('weekly');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="dashboard-card h-[424px] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Top categories</h2>
          <div className="h-10 w-32 animate-pulse rounded-md bg-gray-100" />
        </div>
        <div className="h-[340px] w-full animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="dashboard-card h-[424px] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Top categories</h2>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Weekly" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[340px] w-full">
        <PolarArea options={options} data={data} />
      </div>
    </div>
  );
}