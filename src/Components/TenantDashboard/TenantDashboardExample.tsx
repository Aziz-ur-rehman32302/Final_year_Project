import React from 'react';
import TenantNotifications from './TenantNotifications';

const TenantDashboardExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tenant Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications Section */}
          <div className="lg:col-span-2">
            <TenantNotifications />
          </div>
          
          {/* Other dashboard components can go here */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Status</h2>
            <p className="text-gray-600">Payment information will be displayed here...</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lease Information</h2>
            <p className="text-gray-600">Lease details will be displayed here...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboardExample;