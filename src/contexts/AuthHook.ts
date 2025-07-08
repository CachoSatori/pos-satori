import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './AuthContextTypes';

/**
 * Hook para consumir el contexto de autenticación.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

/**
 * Sugerencias de pruebas (Vitest):
 * - Verifica que useAuth lance error fuera del provider.
 * - Verifica que useAuth provea user, loading, login, logout y role correctamente.
 */