import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Table } from '../types';

// Interfaz del contexto para mesas
interface MesasContextType {
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  loading: boolean;
}

// Crear el contexto
const MesasContext = createContext<MesasContextType | undefined>(undefined);

// Provider que obtiene las mesas desde Firestore y las expone como Table[]
export const MesasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

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

// Hook para consumir el contexto de mesas
export const useMesas = () => {
  const context = useContext(MesasContext);
  if (!context) {
    throw new Error('useMesas debe usarse dentro de MesasProvider');
  }
  return context;
};