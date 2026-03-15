import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import SharedNavbar from '../SharedNavbar';
import { getToken } from '../../utils/auth';

const AdminBoard = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch('http://localhost/plaza_management_system_backend/unread_issues_count.php', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }).catch(() => ({ ok: false }));

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success') {
            setUnreadCount(result.count || 0);
          }
        }
      } catch (err) {
        console.error('Unread count fetch error:', err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleNavButton = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }
  
  const toggledashboardButton = () => {
    setIsSidebarVisible(false)
  }

  return (
    <div className="min-h-screen bg-gray-50  w-full">
      {/* Shared Navbar */}
      <SharedNavbar 
        title="Plaza Management"
        userType="Admin"
        onMenuToggle={toggleNavButton}
        isMenuVisible={isSidebarVisible}
        showMenuButton={true}
        unreadCount={unreadCount}
      />
      
      {/* Main Layout */}
      <div className="flex ">
        {/* Admin Sidebar */}
        <AdminSidebar 
          toggledashboardButton={toggledashboardButton} 
          isVisible={isSidebarVisible} 
        />
      </div>
    </div>
  )
}

export default AdminBoard
