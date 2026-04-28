import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

const RentSummary = () => {
  // State for rent summary data
  const [TotalAmount, setTotalAmount] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalUnPaidAmount, setTotalUnPaidAmount] = useState(0);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch rent summary data
  const fetchRentSummary = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching rent summary from API...');

      const response = await fetch(API_BASE_URL + '/rent_summary.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server');
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (data.status === 'success') {
        setTotalAmount(data.TotalAmount || 0);
        setTotalPaidAmount(data.totalPaidAmount || 0);
        setTotalUnPaidAmount(data.totalUnPaidAmount || 0);
        console.log('✅ Rent Summary Data loaded successfully:', {
          TotalAmount: data.TotalAmount,
          totalPaidAmount: data.totalPaidAmount,
          totalUnPaidAmount: data.totalUnPaidAmount
        });
      } else {
        throw new Error(data.message || 'Failed to fetch rent summary');
      }
    } catch (err) {
      console.error('❌ Rent summary fetch error:', err);
      
      // Handle different types of errors
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error: Unable to connect to server. Please check if the backend is running.');
      } else if (err.message.includes('HTTP 404')) {
        setError('API endpoint not found. Please check the backend configuration.');
      } else if (err.message.includes('HTTP 500')) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load rent summary. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRentSummary();
  }, []);

  // Retry function
  const handleRetry = () => {
    fetchRentSummary();
  };

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 border border-gray-300 rounded-xl bg-white animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-200 p-3 rounded-lg w-fit">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
        <button 
          onClick={handleRetry}
          className="ml-auto bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Total Due Card */}
      <div className="p-6 border border-gray-300 rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 ease-in-out animate-card-appear">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-100 p-3 rounded-lg w-fit">
            <DollarSign className="text-blue-600 w-6 h-6" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            ${TotalAmount.toLocaleString()}
          </h1>
          <p className="text-gray-600 mt-1">Total Due</p>
        </div>
      </div>

      {/* Total Paid Card */}
      <div className="p-6 border border-gray-300 rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 ease-in-out animate-card-appear" style={{animationDelay: '0.1s'}}>
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-100 p-3 rounded-lg w-fit">
            <TrendingUp className="text-green-600 w-6 h-6" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            ${totalPaidAmount.toLocaleString()}
          </h1>
          <p className="text-gray-600 mt-1">Total Paid</p>
        </div>
      </div>

      {/* Total Unpaid Card */}
      <div className="p-6 border border-gray-300 rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 ease-in-out animate-card-appear" style={{animationDelay: '0.2s'}}>
        <div className="flex items-center justify-between mb-4">
          <div className="bg-red-100 p-3 rounded-lg w-fit">
            <AlertCircle className="text-red-600 w-6 h-6" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            ${totalUnPaidAmount.toLocaleString()}
          </h1>
          <p className="text-gray-600 mt-1">Total Unpaid</p>
        </div>
      </div>
    </div>
  );
};

export default RentSummary;