import React from 'react';

const KpiCard = ({ title, value, description, icon: Icon, gradientStyle }) => {
  return (
    <div className="text-white p-6 rounded-2xl shadow-lg" style={gradientStyle}>
      <div className="flex items-center justify-between">
        <div>
          <p className="opacity-80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {description && <p className="text-sm mt-1 opacity-90">{description}</p>}
        </div>
        {Icon && <Icon size={48} className="opacity-75" />}
      </div>
    </div>
  );
};

export default KpiCard;