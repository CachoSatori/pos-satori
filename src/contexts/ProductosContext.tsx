import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase';
import type { ProductosContextType } from './ProductosContextTypes';
import type { Product } from '../types';

/**
 * Contexto de productos.
 */
export const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

/**
 * Provider para el contexto de productos.
 */
export const ProductosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        setLoading(false);
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.error('Error en onSnapshot para products:', error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

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