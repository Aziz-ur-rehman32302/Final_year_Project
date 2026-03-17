import React, { useState } from 'react';
import TenantNavBar from './TenantNavBar';
import TenantSideBar from './TenantSideBar';
import DashBoard from './DashBoard';
import TenantNotification from './TenantNotification';

const TenantDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'notifications'>(() => {
    if (typeof window === 'undefined') return 'dashboard';
    try {
      const stored = window.localStorage.getItem('tenant_active_section');
      return stored === 'notifications' ? 'notifications' : 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  const showTenantDashboard = () => {
    setActiveSection('dashboard');
    if (window.innerWidth < 1024) setSidebarOpen(false); // Close on mobile
    try {
      window.localStorage.setItem('tenant_active_section', 'dashboard');
    } catch {
      // ignore storage errors
    }
  };

  const showTenantNotifications = () => {
    setActiveSection('notifications');
    if (window.innerWidth < 1024) setSidebarOpen(false); // Close on mobile
    try {
      window.localStorage.setItem('tenant_active_section', 'notifications');
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full flex flex-col overflow-x-hidden">
      {/* Tenant top navigation (logout, branding) */}
      <TenantNavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main layout */}
      <div className="flex flex-1 w-full relative min-w-0">
        
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div 
          className={`absolute lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out bg-white min-h-full border-r w-64 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <TenantSideBar
            sidebarOpen={sidebarOpen}
            activeSection={activeSection}
            triggerTenantNotification={showTenantNotifications}
            triggerTenantDastBoard={showTenantDashboard}
          />
        </div>

        {/* Primary content area */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {activeSection === 'dashboard' && (
              <DashBoard />
            )}
            {activeSection === 'notifications' && (
              <div className="animate-slide-up">
                <TenantNotification />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TenantDashboard;