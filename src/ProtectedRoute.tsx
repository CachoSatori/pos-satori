import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, role, loading } = useAuth();

  console.log('ProtectedRoute check:', { user: !!user, role, loading });

  if (loading) {
    console.log('ProtectedRoute: Loading authentication state');
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (role !== 'admin') {
    console.log('ProtectedRoute: User is not admin, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;