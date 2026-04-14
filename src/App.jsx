import React from 'react'
import AdminLogin from './Components/Login/AdminLogin'
import TenantLogin from './Components/Login/TenantLogin'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminBoard from './Components/AdminDashboard/AdminBoard'
import TenantDashboard from './Components/TenantDashboard/TenantDashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import { isAuthenticated, getUser } from './utils/auth';

const App = () => {
  return (
    <div className="w-full min-h-screen">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              isAuthenticated() ? (
                getUser()?.role === 'admin' ? 
                  <Navigate to="/admin-dashboard" replace /> : 
                  <Navigate to="/tenant-dashboard" replace />
              ) : (
                <AdminLogin />
              )
            } 
          />
          <Route 
            path="/tenant-login" 
            element={
              isAuthenticated() ? (
                getUser()?.role === 'tenant' ? 
                  <Navigate to="/tenant-dashboard" replace /> : 
                  <Navigate to="/admin-dashboard" replace />
              ) : (
                <TenantLogin />
              )
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminBoard />
              </ProtectedRoute>
            } 
          />

          {/* Security Routes strictly for mapping requirements (they point to AdminBoard) */}
          <Route path="/admin/security-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminBoard/></ProtectedRoute>} />
          <Route path="/admin/security-guards" element={<ProtectedRoute requiredRole="admin"><AdminBoard/></ProtectedRoute>} />
          <Route path="/admin/security-visitors" element={<ProtectedRoute requiredRole="admin"><AdminBoard/></ProtectedRoute>} />
          <Route path="/admin/security-cameras" element={<ProtectedRoute requiredRole="admin"><AdminBoard/></ProtectedRoute>} />
          <Route path="/admin/security-incidents" element={<ProtectedRoute requiredRole="admin"><AdminBoard/></ProtectedRoute>} />
          <Route path="/admin/security-alerts" element={<ProtectedRoute requiredRole="admin"><AdminBoard/></ProtectedRoute>} />

          <Route 
            path="/tenant-dashboard" 
            element={
              <ProtectedRoute requiredRole="tenant">
                <TenantDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
