import type { Product } from '../types/Product';

export interface ProductosContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  loading: boolean;
}