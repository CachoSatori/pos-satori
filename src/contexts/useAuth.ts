import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './AuthContextTypes';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context as AuthContextType;
};