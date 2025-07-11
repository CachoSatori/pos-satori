import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase';
import type { Table } from '../types';
import type { MesasContextType } from './MesasContextTypes';

/**
 * Contexto de mesas.
 */
export const MesasContext = createContext<MesasContextType | undefined>(
  undefined
);

/**
 * Provider para el contexto de mesas.
 */
export const MesasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mesas, setMesas] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'tables'),
      (snapshot) => {
        const fetchedMesas = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Table
        );
        setMesas(fetchedMesas);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  return (
    <MesasContext.Provider value={{ mesas, loading }}>
      {children}
    </MesasContext.Provider>
  );
};

/**
 * Exporta el hook useMesas.
 * @returns El contexto de mesas.
 * @throws Error si se usa fuera de MesasProvider.
 */
export const useMesas = (): MesasContextType => {
  const context = useContext(MesasContext);
  if (!context) throw new Error('useMesas debe usarse dentro de MesasProvider');
  return context;
};
