import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell, 
  LogOut, 
  AlertCircle, 
  X,
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  Loader2
} from 'lucide-react';

const Admin_Cards = () => {
  // Rent summary states
  const [rentData, setRentData] = useState({
    TotalAmount: 0,
    totalPaidAmount: 0,
    totalUnPaidAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch rent summary data
  useEffect(() => {
    const fetchRentSummary = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('🔄 Fetching rent summary from API...');

        const response = await fetch(API_BASE_URL + '/rent_summary.php', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('📊 Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseText = await response.text();
        console.log('📄 Raw response:', responseText);
        
        if (!responseText || responseText.trim() === '') {
          throw new Error('Empty response from server');
        }

        let data;
        try {
          data = JSON.parse(responseText);
          console.log('✅ Parsed data:', data);
        } catch (parseError) {
          console.error('❌ JSON parse error:', parseError);
          throw new Error('Invalid JSON response from server');
        }

        if (data.status === 'success') {
          setRentData({
            TotalAmount: data.TotalAmount || 0,
            totalPaidAmount: data.totalPaidAmount || 0,
            totalUnPaidAmount: data.totalUnPaidAmount || 0
          });
          console.log('✅ Rent summary loaded successfully:', {
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

    fetchRentSummary();
  }, []);
  
  // Retry function
  const handleRetry = () => {
    window.location.reload();
  };
  return (
    <div className='flex pb-4 flex-wrap justify-evenly pl-2 mt-2 w-full'>
      {/* Loading State */}
      {loading && (
        <div className="w-full flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-blue-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg">Loading dashboard statistics...</span>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button 
            onClick={handleRetry}
            className="ml-auto bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Rent Summary Cards - Only show when data is loaded */}
      {!loading && !error && (
        <>
          {/* Total Due Card */}
          <div className='flex flex-col lg:w-[23%] sm:w-[48%] w-full gap-5 px-6 py-5 pb-9 rounded-xl bg-blue-600 mt-7 hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-300 ease-in-out animate-slide-up'>
            <div className='flex justify-between'>
              <DollarSign className='h-7 w-7 text-white'/>
              <TrendingUp className="w-7 h-7 bg-blue-700 p-1 rounded text-white" />
            </div>
            <div>
                <h1 className='text-2xl text-white font-medium'>₨ {rentData.TotalAmount.toLocaleString()}</h1>
                <h1 className='text-lg text-white'>Total Due</h1>
            </div>
          </div>

          {/* Total Paid Card */}
          <div className='flex flex-col gap-5 lg:w-[23%] sm:w-[48%] w-full border px-6 py-5 pb-9 rounded-xl bg-green-50 border-green-200 mt-7 hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-300 ease-in-out animate-slide-up' style={{animationDelay: '0.1s'}}>
              <div className='flex justify-between'>
               <TrendingUp className="w-7 h-7 text-green-600 rounded p-1 bg-green-100" />
              </div>
              <div>
                  <h1 className='text-2xl font-medium text-green-800'>₨ {rentData.totalPaidAmount.toLocaleString()}</h1>
                  <h1 className='text-lg text-green-700'>Total Paid</h1>
              </div>
          </div>

          {/* Total Unpaid Card */}
          <div className='flex flex-col gap-5 lg:w-[23%] sm:w-[48%] w-full border px-6 py-5 pb-9 rounded-xl bg-red-50 border-red-200 mt-7 hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-300 ease-in-out animate-slide-up' style={{animationDelay: '0.2s'}}>
              <div className='flex justify-between'>
               <AlertCircle className="w-7 h-7 text-red-600 rounded p-1 bg-red-100" />
              </div>
              <div>
                  <h1 className='text-2xl font-medium text-red-800'>₨ {rentData.totalUnPaidAmount.toLocaleString()}</h1>
                  <h1 className='text-lg text-red-700'>Total Unpaid</h1>
              </div>
          </div>

          {/* Additional Info Card (Optional) */}
          <div className='flex flex-col gap-5 lg:w-[23%] sm:w-[48%] w-full border sm:px-6 pl-6 py-5 pb-9 rounded-xl bg-gray-50 border-gray-200 mt-7 hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-300 ease-in-out animate-slide-up' style={{animationDelay: '0.3s'}}>
              <div className='flex justify-between'>
               <Calendar className="w-7 h-7 text-blue-600 rounded p-1 bg-blue-100" />
              </div>
              <div>
                  <h1 className='text-2xl font-medium text-gray-800'>{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</h1>
                  <h1 className='text-lg text-gray-600'>Current Period</h1>
              </div>
           </div>
        </>
      )}
    </div>
  )
}

export default Admin_Cards
