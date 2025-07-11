// SOLUCIÓN: Asegúrate de que el tipo AuthContextType esté correctamente importado y que el contexto provea loading, login y logout.
// Si el contexto ya los provee, este hook es correcto:
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './AuthContextTypes';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
