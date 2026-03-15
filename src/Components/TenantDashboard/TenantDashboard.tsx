import React from 'react';
import TenantNotificationsPanel from './TenantNotificationsPanel';
import SharedNavbar from '../SharedNavbar';
import { CreditCard, FileText, Settings } from 'lucide-react';

const TenantDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Shared Navbar */}
      <SharedNavbar 
        title="Plaza Management - Tenant Portal"
        userType="Tenant"
        showMenuButton={false}
      />

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Navigation */}
        <div className="mb-8">
          <nav className="flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white transition-colors">
              <CreditCard className="w-4 h-4" />
              Payments
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white transition-colors">
              <FileText className="w-4 h-4" />
              Documents
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </a>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifications Panel - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2">
            <TenantNotificationsPanel />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Pay Rent</span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Submit Request</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Balance:</span>
                  <span className="font-semibold text-gray-900">$2,500.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Due Date:</span>
                  <span className="font-semibold text-gray-900">Dec 15, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lease Expires:</span>
                  <span className="font-semibold text-gray-900">Mar 31, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TenantDashboard;