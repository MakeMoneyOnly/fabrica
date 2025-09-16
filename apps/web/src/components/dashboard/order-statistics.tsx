'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import React from 'react';

interface HeatmapCellData {
  salesValue: number;
  totalOrders: number;
  averageOrderValue: number;
  comparedToAverage: number;
  isHighTraffic: boolean;
}

export function OrderStatistics() {
  const [timeframe, setTimeframe] = useState('weekly');
  
  // Generate random data for the heatmap
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['2PM', '3PM', '4PM', '5PM', '6PM', '7PM'];
  
  const getHeatmapCellData = (intensity: number): HeatmapCellData => {
    const salesValue = intensity * 150;
    const totalOrders = Math.floor(intensity * 12);
    const averageOrderValue = salesValue / (totalOrders || 1);
    const comparedToAverage = ((salesValue / 300) * 100 - 100);
    const isHighTraffic = intensity > 3;

    return {
      salesValue,
      totalOrders,
      averageOrderValue,
      comparedToAverage,
      isHighTraffic
    };
  };
  
  // Generate a random intensity between 0-5 for each cell
  const generateHeatmapData = () => {
    const data: number[][] = [];
    for (let i = 0; i < hours.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < days.length; j++) {
        // Random intensity between 0-5
        const intensity = Math.floor(Math.random() * 6);
        row.push(intensity);
      }
      data.push(row);
    }
    return data;
  };
  
  const heatmapData = generateHeatmapData();

  return (
    <div className="dashboard-card h-full p-6 pb-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Orders statistics</h2>
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
      
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">97 orders</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1.5">
        {/* Day headers */}
        {days.map((day, index) => (
          <div key={`day-${index}`} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Heatmap cells */}
        {heatmapData.map((row, hourIndex) => (
          <React.Fragment key={`row-${hourIndex}`}>
            {row.map((intensity, dayIndex) => {
              const cellData = getHeatmapCellData(intensity);
              
              // Determine tooltip side based on day position
              const tooltipSide = dayIndex === 0 || dayIndex === 1 ? "right" : dayIndex === 5 || dayIndex === 6 ? "left" : "top";
              
              return (
                <TooltipProvider key={`cell-${hourIndex}-${dayIndex}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`heatmap-cell heatmap-cell-${intensity} ${intensity > 0 ? 'hover:scale-105' : ''}`}
                        style={{
                          height: '48px',
                          width: '100%',
                          borderRadius: '6px',
                          transition: 'all 0.2s ease-in-out',
                          backgroundColor: `rgba(34, 197, 94, ${intensity * 0.2})`,
                          cursor: 'pointer'
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent 
                      side={tooltipSide}
                      align="center"
                      sideOffset={5}
                      className="bg-white text-gray-900 border shadow-lg p-4 w-[300px] z-[1000]"
                      avoidCollisions
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-2">
                          <div>
                            <span className="font-semibold text-lg">{days[dayIndex]}</span>
                            <span className="text-gray-500 ml-2">{hours[hourIndex]}</span>
                          </div>
                          <Badge variant={cellData.isHighTraffic ? 'default' : 'secondary'} className={
                            cellData.isHighTraffic ? 'bg-green-100 text-green-800' : ''
                          }>
                            {cellData.isHighTraffic ? '🔥 Peak Hours' : 'Regular Hours'}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Sales</span>
                            <span className="font-semibold text-lg">${cellData.salesValue.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Orders</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{cellData.totalOrders}</span>
                              <span className="text-sm text-gray-500">orders</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Avg. Order Value</span>
                            <span className="font-medium">${cellData.averageOrderValue.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">vs. Average</span>
                            <span className={`font-medium ${
                              cellData.comparedToAverage > 0 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {cellData.comparedToAverage > 0 ? '↑' : '↓'} {Math.abs(cellData.comparedToAverage).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 bg-green-50 p-2 rounded-md text-sm text-green-800">
                          <div className="flex gap-2 items-start">
                            <span>💡</span>
                            {cellData.isHighTraffic ? (
                              <span>Peak selling period with {cellData.totalOrders} orders. Consider:
                                <ul className="list-disc ml-4 mt-1">
                                  <li>Increasing inventory levels</li>
                                  <li>Adding extra staff support</li>
                                  <li>Running promotions during slower hours</li>
                                </ul>
                              </span>
                            ) : cellData.comparedToAverage < -20 ? (
                              <span>Low traffic period. Opportunities:
                                <ul className="list-disc ml-4 mt-1">
                                  <li>Run special promotions to boost sales</li>
                                  <li>Schedule inventory restocking</li>
                                  <li>Plan staff training sessions</li>
                                </ul>
                              </span>
                            ) : cellData.comparedToAverage < 0 ? (
                              <span>Moderate traffic period. Consider:
                                <ul className="list-disc ml-4 mt-1">
                                  <li>Running targeted marketing campaigns</li>
                                  <li>Optimizing staff schedules</li>
                                  <li>Analyzing customer preferences</li>
                                </ul>
                              </span>
                            ) : (
                              <span>Above average performance. Actions:
                                <ul className="list-disc ml-4 mt-1">
                                  <li>Monitor inventory levels closely</li>
                                  <li>Ensure adequate staff coverage</li>
                                  <li>Analyze successful sales patterns</li>
                                </ul>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </React.Fragment>
        ))}
        
        {/* Time labels */}
        <div className="col-span-7 mt-1 grid grid-cols-6 text-xs text-gray-500">
          {hours.map((hour, index) => (
            <div key={`hour-${index}`} className="text-center font-medium">
              {hour}
            </div>
          ))}
        </div>
      </div>
      
      {/* Summary section */}
      <div className="mt-3 grid grid-cols-3 gap-4 border-t border-gray-100 pt-3">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Peak Hour</p>
          <p className="mt-0.5 text-xl font-semibold text-gray-900">4PM</p>
          <p className="mt-0 text-xs text-gray-500">Most active time</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Busiest Day</p>
          <p className="mt-0.5 text-xl font-semibold text-gray-900">Wednesday</p>
          <p className="mt-0 text-xs text-gray-500">Highest volume</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Avg. Orders</p>
          <p className="mt-0.5 text-xl font-semibold text-gray-900">14.2</p>
          <p className="mt-0 text-xs text-gray-500">Per day</p>
        </div>
      </div>
    </div>
  );
} 