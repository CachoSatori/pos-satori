import type { Product } from '../types';

/**
 * Interfaz para el contexto de productos.
 */
export interface ProductosContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  loading: boolean;
}