import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, onSnapshot, FirestoreError } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db, logError } from '../services/firebase';
import { Table } from '../types';

interface MesasContextType {
  tables: Table[];
  loading: boolean;
}

const MesasContext = createContext<MesasContextType>({ tables: [], loading: false });

export const MesasProvider = ({ children }: { children: ReactNode }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'tables'),
      (snapshot) => {
        try {
          const tablesData: Table[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              number: data.number ?? '',
              status: data.status ?? 'available',
            };
          });
          setTables(tablesData);
          setLoading(false);
        } catch (error: unknown) {
          toast.error('Error al cargar mesas');
          logError(error as Error);
          setLoading(false);
        }
      },
      (error: FirestoreError) => {
        toast.error('Error en el listener de mesas');
        logError(error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <MesasContext.Provider value={{ tables, loading }}>
      {children}
    </MesasContext.Provider>
  );
};

export const useMesas = () => useContext(MesasContext);