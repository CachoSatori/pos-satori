import { useContext } from 'react';
import { ProductosContext } from './ProductosContext';
import type { ProductosContextType } from './ProductosContextTypes';

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