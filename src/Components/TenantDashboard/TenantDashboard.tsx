import React, { useState } from 'react';
import TenantNavBar from './TenantNavBar';
import TenantSideBar from './TenantSideBar';
import DashBoard from './DashBoard';
import TenantNotificationsPanel from './TenantNotificationsPanel';

const TenantDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'notifications'>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const stored = window.localStorage.getItem('tenant_active_section');
      return stored === 'notifications' ? 'notifications' : 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  const showTenantDashboard = () => {
    setActiveSection('dashboard');
    try {
      window.localStorage.setItem('tenant_active_section', 'dashboard');
    } catch {
      // ignore storage errors
    }
  };

  const showTenantNotifications = () => {
    setActiveSection('notifications');
    try {
      window.localStorage.setItem('tenant_active_section', 'notifications');
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full flex flex-col">
      {/* Tenant top navigation (logout, branding) */}
      <TenantNavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main layout */}
      <div className="flex flex-1 w-full">
        {/* Sidebar */}
        <div className="border-r min-h-full w-64 hidden lg:block bg-white">
          <TenantSideBar
            sidebarOpen={sidebarOpen}
            activeSection={activeSection}
            triggerTenantNotification={showTenantNotifications}
            triggerTenantDastBoard={showTenantDashboard}
          />
        </div>

        {/* Primary content area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {activeSection === 'dashboard' && (
              <DashBoard />
            )}
            {activeSection === 'notifications' && (
              <div className="animate-slide-up">
                <TenantNotificationsPanel />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TenantDashboard;