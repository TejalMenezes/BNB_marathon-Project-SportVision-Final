
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-brand-gray p-5 rounded-lg shadow-lg flex items-center space-x-4">
      <div className="bg-brand-accent/20 p-3 rounded-full">
        <div className="h-6 w-6 text-brand-accent">{icon}</div>
      </div>
      <div>
        <p className="text-sm text-brand-light-gray">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
