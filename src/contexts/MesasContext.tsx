import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { MesasContextType } from './MesasContextTypes';

export const MesasContext = createContext<MesasContextType | undefined>(undefined);

export const MesasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  // Aquí deberías usar onSnapshot y setLoading(false) cuando termine la carga

  return (
    <MesasContext.Provider value={{ tables, setTables, loading }}>
      {children}
    </MesasContext.Provider>
  );
};

export const useMesas = (): MesasContextType => {
  const context = useContext(MesasContext);
  if (!context) {
    throw new Error('useMesas debe usarse dentro de MesasProvider');
  }
  return context;
};