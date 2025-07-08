import type { Table } from '../types';

/**
 * Interfaz para el contexto de mesas.
 */
export interface MesasContextType {
  tables: Table[];
  setTables: (tables: Table[]) => void;
  loading: boolean;
}