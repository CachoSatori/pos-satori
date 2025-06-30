import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../services/firebase';

interface Table {
  id: string;
  number: number;
  status: 'available' | 'occupied';
}

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
      (snapshot: QuerySnapshot<DocumentData>) => {
        const tablesData = snapshot.docs.map(
          doc => ({ id: doc.id, ...doc.data() } as Table)
        );
        setTables(tablesData);
        setLoading(false);
      },
      (error) => {
        toast.error('Error al cargar mesas');
        console.error(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <MesasContext.Provider value={{ tables, loading }}>
      {children}
    </MesasContext.Provider>
  );
};

export const useMesas = () => useContext(MesasContext);