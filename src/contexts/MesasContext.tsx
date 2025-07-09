import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db, logError } from '../firebase';
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
        const fetchedTables = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Table));
        if (fetchedTables.length === 0) {
          logError({ error: new Error('MesasContext vacío: no se encontraron documentos en la colección tables'), context: 'MesasContext' });
        }
        setTables(fetchedTables);
        setLoading(false);
      },
      (error) => {
        logError({ 
          error, 
          context: 'MesasContext', 
          details: `Código: ${(error as any)?.code ?? 'N/A'}, Mensaje: ${error.message ?? (error as any)?.message ?? 'N/A'}` 
        });
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