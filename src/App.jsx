import React from 'react'
import AdminLogin from './Components/Login/AdminLogin'
import TenantLogin from './Components/Login/TenantLogin'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminBoard from './Components/AdminDashboard/AdminBoard'
import TenantDashboard from './Components/TenantDashboard/TenantDashboard';

const App = () => {
  return (
    <div >
      
      <Router>
         <Routes>
           <Route path="/" element={ <AdminLogin/>} />
           <Route path="/tenant-login" element={ <TenantLogin/>} />
           {/* protected dashboards */}
           <Route path="/admin-dashboard" element={<AdminBoard />} />
           <Route path="/tenant-dashboard" element={<TenantDashboard />} />
         </Routes>
      </Router>
      {/* <AdminBoard/> */}
      {/* <TenantDashboard/> */}
    </div>
  )
}

export default App
