import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthHook';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [],
  children,
}) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1C2526] text-[#00A6A6]">
        <span className="text-xl font-bold">Cargando...</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Usar role del contexto, no user.role
  if (allowedRoles.length > 0 && !allowedRoles.includes(role ?? '')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
