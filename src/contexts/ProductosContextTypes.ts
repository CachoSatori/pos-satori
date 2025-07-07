export interface ProductosContextType {
  products: any[];
  setProducts: (products: any[]) => void;
  loading: boolean;
}