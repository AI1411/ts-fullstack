'use client'

import React from 'react';

interface ChartProps {
  title: string;
  children: React.ReactNode;
}

const Chart: React.FC<ChartProps> = ({title, children}) => {
  return (
    <div className="rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
      {children}
    </div>
  );
};

export default Chart;
