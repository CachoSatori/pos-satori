import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ProductosContextType } from './ProductosContextTypes';

export const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

export const ProductosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Aquí deberías usar onSnapshot y setLoading(false) cuando termine la carga

  return (
    <ProductosContext.Provider value={{ products, setProducts, loading }}>
      {children}
    </ProductosContext.Provider>
  );
};

export const useProductos = (): ProductosContextType => {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error('useProductos debe usarse dentro de ProductosProvider');
  }
  return context;
};