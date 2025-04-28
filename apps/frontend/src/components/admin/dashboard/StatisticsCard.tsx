'use client'

import React from 'react';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isUp: boolean;
  };
  bgColor?: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon,
  trend,
  bgColor = 'bg-white dark:bg-gray-800',
}) => {
  return (
    <div className={`rounded-md ${bgColor} p-6 shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          
          {trend && (
            <div className="mt-2 flex items-center">
              <span
                className={`mr-1 text-sm font-medium ${
                  trend.isUp ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {trend.isUp ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">前月比</span>
            </div>
          )}
        </div>
        
        <div className="rounded-full bg-blue-50 p-3 text-blue-500 dark:bg-blue-500/10">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
