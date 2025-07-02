import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div className="text-text">Cargando...</div>;
  }

  if (!user || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;