import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Order } from '../types';

/**
 * Tipos para el contexto de órdenes.
 */
export interface OrdersContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  loading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

/**
 * Provider para el contexto de órdenes.
 */
export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const fetchedOrders: Order[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Order, 'id'>)
      }));
      setOrders(fetchedOrders);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, setOrders, loading }}>
      {children}
    </OrdersContext.Provider>
  );
};

/**
 * Hook para consumir el contexto de órdenes.
 */
export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders debe usarse dentro de OrdersProvider');
  }
  return context;
};

/**
 * Sugerencias de pruebas (Vitest):
 * - Verifica que useOrders lance error fuera del provider.
 * - Verifica que OrdersProvider provea órdenes y loading correctamente.
 */
