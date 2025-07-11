import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db, logError } from '../firebase';
import { ProductosContextType } from './ProductosContextTypes';
import type { Product } from '../types';

/**
 * Contexto de productos.
 */
export const ProductosContext = createContext<ProductosContextType | undefined>(
  undefined
);

/**
 * Provider para el contexto de productos.
 */
export const ProductosProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const fetchedProducts = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Product
        );
        if (fetchedProducts.length === 0) {
          logError({
            error: new Error(
              'ProductosContext vacío: no se encontraron documentos en la colección products'
            ),
            context: 'ProductosContext',
          });
        }
        setProducts(fetchedProducts);
        setLoading(false);
      },
      (error) => {
        logError({
          error,
          context: 'ProductosContext',
          details: `Código: ${(error as any)?.code ?? 'N/A'}, Mensaje: ${error.message ?? (error as any)?.message ?? 'N/A'}`,
        });
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Asegura que addProduct acepte Omit<Product, "id">
  const addProduct = async (product: Omit<Product, 'id'>) => {
    // lógica para agregar producto
  };

  const updateProduct = async (productId: string, updatedData: Partial<Product>) => {
    // Lógica para actualizar un producto
  };

  const deleteProduct = async (productId: string) => {
    // Lógica para eliminar un producto
  };

  const fetchProducts = async () => {
    setLoading(true);
    // Lógica para obtener productos
    setLoading(false);
  };

  return (
    <ProductosContext.Provider
      value={{
        products,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        fetchProducts,
        loading,
      }}
    >
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
