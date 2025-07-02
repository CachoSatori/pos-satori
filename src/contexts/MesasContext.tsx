import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Interfaz Mesa
interface Mesa {
  id: string;
  numero: number;
  estado: 'libre' | 'ocupada' | 'reservada';
}

// 2. Interfaz MesasContextType
interface MesasContextType {
  tables: Mesa[];
  setTables: React.Dispatch<React.SetStateAction<Mesa[]>>;
  loading: boolean;
}

// 3. Crear el contexto
const MesasContext = createContext<MesasContextType | undefined>(undefined);

// 4. MesasProvider como componente React que retorna un ReactNode
export const MesasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <MesasContext.Provider value={{ tables, setTables, loading }}>
      {children}
    </MesasContext.Provider>
  );
};

// 5. Mantener useMesas sin cambios
export const useMesas = () => {
  const context = useContext(MesasContext);
  if (!context) {
    throw new Error('useMesas debe usarse dentro de MesasProvider');
  }
  return context;
};