import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import AdminboardHeader from './AdminboardHeader'

const AdminBoard = () => {
  const navigate = useNavigate();
  // work on lg screen
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (!token || !user || user.role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  const toggleNavButton = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }
  const toggledashboardButton = () => {
    setIsSidebarVisible(false)
  }

  return (
    <div className=''>
      <AdminNavbar toggleNavButton={toggleNavButton} isVisible={isSidebarVisible}  />
      <AdminSidebar toggledashboardButton={toggledashboardButton} isVisible={isSidebarVisible}  />
      {/* <AdminboardHeader/>    */}
    </div>
  )
}

export default AdminBoard
