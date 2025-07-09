import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db, logError } from '../firebase';
import type { OrdersContextType } from './OrdersContextTypes';
import type { Order } from '../types';

/**
 * Contexto de órdenes.
 */
export const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

/**
 * Provider para el contexto de órdenes.
 */
export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        if (fetchedOrders.length === 0) {
          logError({ error: new Error('OrdersContext vacío: no se encontraron documentos en la colección orders'), context: 'OrdersContext' });
        } else {
          logError({ error: new Error(`OrdersContext cargó ${fetchedOrders.length} órdenes`), context: 'OrdersContext' });
        }
        setOrders(fetchedOrders);
        setLoading(false);
      },
      (error) => {
        logError({ error, context: 'OrdersContext', details: `Código: ${error.code}, Mensaje: ${error.message}` });
        setOrders([]);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, setOrders, loading }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders debe usarse dentro de OrdersProvider');
  }
  return context;
};
