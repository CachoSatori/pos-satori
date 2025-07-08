import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase';
import type { MesasContextType } from './MesasContextTypes';
import type { Table } from '../types';

/**
 * Contexto de mesas.
 */
export const MesasContext = createContext<MesasContextType | undefined>(undefined);

/**
 * Provider para el contexto de mesas.
 */
export const MesasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'tables'),
      (snapshot) => {
        setTables(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Table)));
        setLoading(false);
      },
      (error) => {
        console.error('Error en onSnapshot para tables:', error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return (
    <MesasContext.Provider value={{ tables, setTables, loading }}>
      {children}
    </MesasContext.Provider>
  );
};