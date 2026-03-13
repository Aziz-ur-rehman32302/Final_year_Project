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
import { getToken } from '../../utils/auth';

const Admin_Cards = () => {
  // Dashboard stats states
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost/plaza_management_system_backend/admin_dashboard_stats.php', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
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
        } catch (parseError) {
          throw new Error('Invalid response format');
        }

        if (result.status === 'success' && result.data) {
          setDashboardStats(result.data);
          console.log('Dashboard Stats:', result.data);
        } else {
          setError(result.message || 'Failed to fetch dashboard statistics');
        }
      } catch (err) {
        console.error('Dashboard stats fetch error:', err);
        setError('Failed to load dashboard statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);
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
            onClick={() => window.location.reload()}
            className="ml-auto bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Dashboard Cards - Only show when data is loaded */}
      {!loading && !error && dashboardStats && (
        <>
          {/* Total Tenants Card */}
          <div className='flex flex-col lg:w-[23%] sm:w-[48%] w-full gap-5 px-6 py-5 pb-9 rounded-xl bg-blue-600 mt-7 hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-300 ease-in-out animate-slide-up'>
            <div className='flex justify-between'>
              <Users className='h-7 w-7 text-white'/>
              <TrendingUp className="w-7 h-7 bg-blue-700 p-1 rounded text-white" />
            </div>
            <div>
                <h1 className='text-2xl text-white font-medium'>{dashboardStats.total_tenants || 0}</h1>
                <h1 className='text-lg text-white'>Total Tenants</h1>
            </div>
          </div>

          {/* Total Paid Rent Card */}
          <div className='flex flex-col gap-5 lg:w-[23%] sm:w-[48%] w-full border px-6 py-5 pb-9 rounded-xl mt-7 hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-300 ease-in-out animate-slide-up' style={{animationDelay: '0.1s'}}>
              <div className='flex justify-between'>
               <DollarSign className="w-7 h-7 text-green-400 rounded p-1 bg-green-900" />
              </div>
              <div>
                  <h1 className='text-2xl font-medium'>${dashboardStats.total_paid_rent?.toLocaleString() || '0'}</h1>
                  <h1 className='text-lg'>Total Paid Rent</h1>
              </div>
          </div>

          {/* Total Unpaid Rent Card */}
          <div className='flex flex-col gap-5 lg:w-[23%] sm:w-[48%] w-full border px-6 py-5 pb-9 rounded-xl mt-7 hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-300 ease-in-out animate-slide-up' style={{animationDelay: '0.2s'}}>
              <div className='flex justify-between'>
               <AlertCircle className="w-7 h-7 text-red-400 rounded p-1 bg-red-900" />
              </div>
              <div>
                  <h1 className='text-2xl font-medium'>${dashboardStats.total_unpaid_rent?.toLocaleString() || '0'}</h1>
                  <h1 className='text-lg'>Total Unpaid Rent</h1>
              </div>
          </div>

          {/* Upcoming Due Dates Card */}
          <div className='flex flex-col gap-5 lg:w-[23%] sm:w-[48%] w-full border sm:px-6 pl-6 py-5 pb-9 rounded-xl mt-7 hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-300 ease-in-out animate-slide-up' style={{animationDelay: '0.3s'}}>
              <div className='flex justify-between'>
               <Calendar className="w-7 h-7 text-red-400 rounded p-1 bg-yellow-200" />
              </div>
              <div>
                  <h1 className='text-2xl font-medium'>{dashboardStats.upcoming_due_dates || 0}</h1>
                  <h1 className='text-lg'>Upcoming Due Dates</h1>
              </div>
           </div>
        </>
      )}
    </div>
  )
}

export default Admin_Cards
