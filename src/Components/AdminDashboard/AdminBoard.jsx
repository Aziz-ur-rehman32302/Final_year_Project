import React, { useState } from 'react'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import AdminboardHeader from './AdminboardHeader'

const AdminBoard = () => {
  // work on lg screen
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

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
