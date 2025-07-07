import type { Table } from '../types/Table';

export interface MesasContextType {
  tables: Table[];
  setTables: (tables: Table[]) => void;
  loading: boolean;
}