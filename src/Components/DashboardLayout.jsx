import React from 'react';
import SharedNavbar from './SharedNavbar';

const DashboardLayout = ({ 
  children, 
  title, 
  userType, 
  showMenuButton = false, 
  onMenuToggle, 
  isMenuVisible = false,
  unreadCount = 0 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SharedNavbar 
        title={title}
        userType={userType}
        showMenuButton={showMenuButton}
        onMenuToggle={onMenuToggle}
        isMenuVisible={isMenuVisible}
        unreadCount={unreadCount}
      />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;