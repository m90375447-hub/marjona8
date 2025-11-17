
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  colorClass?: string;
  icon?: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, colorClass = 'from-islamic-green-500 to-islamic-green-700', icon }) => {
  return (
    <div className={`bg-gradient-to-br ${colorClass} text-white rounded-xl shadow-lg p-4 flex flex-col justify-between`}>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm uppercase tracking-wider opacity-90">{title}</h3>
        {icon && <div className="w-6 h-6 opacity-80">{icon}</div>}
      </div>
      <p className="text-3xl font-bold mt-2 text-right">{value}</p>
    </div>
  );
};

export default SummaryCard;
