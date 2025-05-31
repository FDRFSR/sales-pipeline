import React from 'react';
import { formatCurrency } from './formatters';

// Tooltip personalizzato per Recharts
export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-medium text-gray-800">{label}</p>
        {payload.map((entry, index) => {
          const isCurrency = entry.dataKey === 'volume' || 
                             entry.dataKey === 'totale' ||
                             entry.name?.toLowerCase().includes('volume');
          const valueSuffix = entry.dataKey === 'tasso' ? '%' : '';
          return (
            <p key={`tooltip-${index}-${entry.name}`} style={{ color: entry.color }} className="text-gray-700">
              {entry.name}: {isCurrency ? formatCurrency(entry.value) : entry.value}{valueSuffix}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};