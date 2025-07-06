import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Table } from '../types';

/**
 * Tipos para el contexto de mesas.
 */
export interface MesasContextType {
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  loading: boolean;
}

const MesasContext = createContext<MesasContextType | undefined>(undefined);

/**
 * Provider para el contexto de mesas.
 */
export const MesasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tables'), (snapshot) => {
      const mesas: Table[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Table, 'id'>)
      }));
      setTables(mesas);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <MesasContext.Provider value={{ tables, setTables, loading }}>
      {children}
    </MesasContext.Provider>
  );
};

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

/**
 * Sugerencias de pruebas (Vitest):
 * - Verifica que useMesas lance error fuera del provider.
 * - Verifica que MesasProvider provea mesas y loading correctamente.
 */