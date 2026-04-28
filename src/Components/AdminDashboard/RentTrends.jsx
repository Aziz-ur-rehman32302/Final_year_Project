import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getToken } from '../../utils/auth';

/* CUSTOM TOOLTIP */
const CustomTooltip = ({ active, payload, label }) => {
  
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg text-sm shadow-lg">
        <p className="font-semibold mb-1">{label}</p>
        <p>Collected: Rs {payload[0].value}</p>
        <p className="text-gray-300">
          Expected: Rs {payload[1].value}
        </p>
        <p className="text-green-400 mt-1">
          Pending: Rs {payload[1].value - payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function RentTrends() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRentTrends = async () => {
      try {
        setLoading(true);
        setError('');
        
        const token = getToken();
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(API_BASE_URL + '/rent_collection_trends.php', {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseText = await response.text();
        
        if (!responseText || responseText.trim() === '') {
          throw new Error('Empty response from server');
        }

        let result;
        try {
          result = JSON.parse(responseText);
        } catch (err) {
          console.error("Parse Error:", err);
          throw new Error('Invalid response format');
        }

        if (result.status === 'success') {
          setData(result.data || []);
        } else {
          throw new Error(result.message || 'Failed to fetch rent trends data');
        }
      } catch (err) {
        console.error('Rent trends fetch error:', err);
        setError('Failed to load chart data. Please try again.');
        
        // Fallback to empty data array
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRentTrends();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-300 p-6">
        <h2 className="font-semibold mb-4">Rent Collection Trends</h2>
        <div className="h-64 w-full flex items-center justify-center">
          <p className="text-gray-500">Loading chart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-300 p-6">
        <h2 className="font-semibold mb-4">Rent Collection Trends</h2>
        <div className="h-64 w-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-300 p-6">
        <h2 className="font-semibold mb-4">Rent Collection Trends</h2>
        <div className="h-64 w-full flex items-center justify-center">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-300 p-6">
      <h2 className="font-semibold mb-4">Rent Collection Trends</h2>

      <div className="h-64 w-full" style={{ minHeight: '256px', minWidth: '300px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={256}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip /> }/>

            {/* Collected Rent */}
            <Line
              type="monotone"
              dataKey="collected"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 6 }}
            />

            {/* Expected Rent */}
            <Line
              type="monotone"
              dataKey="expected"
              stroke="#9ca3af"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
