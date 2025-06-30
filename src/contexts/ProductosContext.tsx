import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../services/firebase';

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
}

interface ProductosContextType {
  products: Product[];
  loading: boolean;
}

const ProductosContext = createContext<ProductosContextType>({ products: [], loading: false });

export const ProductosProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const productsData = snapshot.docs.map(
          doc => ({ id: doc.id, ...doc.data() } as Product)
        );
        setProducts(productsData);
        setLoading(false);
      },
      (error) => {
        toast.error('Error al cargar productos');
        console.error(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <ProductosContext.Provider value={{ products, loading }}>
      {children}
    </ProductosContext.Provider>
  );
};

export const useProductos = () => useContext(ProductosContext);