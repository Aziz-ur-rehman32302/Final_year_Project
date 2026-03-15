import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuth = isAuthenticated();
  const user = getUser();

  if (!isAuth) {
    // Redirect to appropriate login page based on required role
    return <Navigate to={requiredRole === 'admin' ? '/' : '/tenant-login'} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard if wrong role
    if (user?.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user?.role === 'tenant') {
      return <Navigate to="/tenant-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;