import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Product } from '../types';

/**
 * Tipos para el contexto de productos.
 */
export interface ProductosContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  loading: boolean;
}

const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

/**
 * Provider para el contexto de productos.
 */
export const ProductosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const fetchedProducts: Product[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, 'id'>)
      }));
      setProducts(fetchedProducts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ProductosContext.Provider value={{ products, setProducts, loading }}>
      {children}
    </ProductosContext.Provider>
  );
};

/**
 * Hook para consumir el contexto de productos.
 */
export const useProductos = (): ProductosContextType => {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error('useProductos debe usarse dentro de ProductosProvider');
  }
  return context;
};

/**
 * Sugerencias de pruebas (Vitest):
 * - Verifica que useProductos lance error fuera del provider.
 * - Verifica que ProductosProvider provea productos y loading correctamente.
 */