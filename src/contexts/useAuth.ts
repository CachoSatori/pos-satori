import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Hook para consumir el contexto de autenticación de forma segura
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}