import React, { createContext, useState, ReactNode } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import type { OrdersContextType } from './OrdersContextTypes';

/**
 * Contexto de órdenes.
 */
export const OrdersContext = createContext<OrdersContextType | undefined>(
  undefined
);

/**
 * Provider para el contexto de órdenes.
 */
export const OrdersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOrders = async (
    filters: { fromDate?: Date; toDate?: Date; ubicacionId?: string } = {}
  ) => {
    setLoading(true);
    try {
      let q = query(collection(db, 'orders'));
      if (filters.fromDate)
        q = query(q, where('date', '>=', filters.fromDate));
      if (filters.toDate) q = query(q, where('date', '<=', filters.toDate));
      if (filters.ubicacionId)
        q = query(q, where('ubicacionId', '==', filters.ubicacionId));
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order)));
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (order: Omit<Order, "id">) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'orders'), order);
      setOrders((prev) => [...prev, { id: docRef.id, ...order }]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (id: string, order: Partial<Order>) => {
    setLoading(true);
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, order);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...order } : o))
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    setLoading(true);
    try {
      const orderRef = doc(db, 'orders', id);
      await deleteDoc(orderRef);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        setOrders,
        addOrder,
        updateOrder,
        deleteOrder,
        fetchOrders,
        loading,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextType => {
  const context = React.useContext(OrdersContext);
  if (!context) throw new Error('useOrders debe usarse dentro de OrdersProvider');
  return context;
};
