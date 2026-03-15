import React from 'react';
import { LogOut, Building2, Bell, User, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutUser, getUser } from '../utils/auth';

const SharedNavbar = ({ 
  title = "Plaza Management", 
  userType = "User", 
  onMenuToggle, 
  isMenuVisible = false,
  showMenuButton = false,
  unreadCount = 0 
}) => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left side - Logo and Title */}
          <div className="flex items-center gap-3">
            {showMenuButton && (
              <button
                className="text-gray-600 hover:text-gray-900 lg:hidden"
                onClick={onMenuToggle}
              >
                {isMenuVisible ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
            <Building2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            {unreadCount > 0 && (
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              </div>
            )}

            {/* User Info */}
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.username || userType}
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">
                ({user?.role || userType})
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SharedNavbar;