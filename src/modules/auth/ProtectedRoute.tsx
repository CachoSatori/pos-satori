import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { AuthContextType } from '../../contexts/AuthContextTypes';

/**
 * Props para ProtectedRoute.
 */
interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

/**
 * Componente ProtectedRoute.
 * Redirige a /login si no autenticado o no tiene rol permitido.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, loading, role } = useAuth() as AuthContextType;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1C2526] text-[#00A6A6]">
        <span className="text-xl font-bold">Cargando...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role ?? user.role ?? '')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;