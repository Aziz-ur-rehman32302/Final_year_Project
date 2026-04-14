import React from 'react';

const colorMap = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
};

export default function StatCard({ title, value, icon, color = 'blue' }) {
  const styles = colorMap[color] || colorMap.blue;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${styles.bg} ${styles.text}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
