
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HistoryScreen: React.FC = () => {
  const { history, addHistoryEntry, formatCurrency } = useAppContext();

  const formattedHistory = history.map(entry => ({
    ...entry,
    name: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
          <p className="label font-bold">{`${label}`}</p>
          <p className="text-blue-500">{`Aktivlar: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-red-500">{`Majburiyatlar: ${formatCurrency(payload[1].value)}`}</p>
          <p className="text-islamic-green-600">{`Sof aktivlar: ${formatCurrency(payload[2].value)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Moliyaviy tarix</h1>
      
      <button 
        onClick={addHistoryEntry} 
        className="w-full bg-islamic-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-islamic-green-700 transition-colors duration-300 text-lg"
      >
        Joriy oy holatini saqlash
      </button>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Sof aktivlar o'sishi</h2>
        {history.length > 1 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="totalAssets" name="Jami aktivlar" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="totalLiabilities" name="Jami majburiyatlar" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="netWorth" name="Sof aktivlar" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 py-10">
            {history.length === 1 ? 'Grafikni ko\'rish uchun yana bir holatni saqlang.' : 'Hali tarixiy holatlar saqlanmagan.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;
