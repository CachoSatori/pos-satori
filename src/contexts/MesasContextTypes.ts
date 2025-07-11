import type { Table } from '../types';

/**
 * Interfaz para el contexto de mesas.
 */
export interface MesasContextType {
  mesas: Table[];
  loading: boolean;
  // ...otros métodos si aplica
}
