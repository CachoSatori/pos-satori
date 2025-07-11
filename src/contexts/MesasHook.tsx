import { useContext } from 'react';
import { MesasContext } from './MesasContext';
import type { MesasContextType } from './MesasContextTypes';

/**
 * Hook para consumir el contexto de mesas.
 */
export const useMesas = (): MesasContextType => {
  const context = useContext(MesasContext);
  if (!context) {
    throw new Error('useMesas debe usarse dentro de MesasProvider');
  }
  return context;
};
