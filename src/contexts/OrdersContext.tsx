import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { OrdersContextType } from './OrdersContextTypes';

export const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Aquí deberías usar onSnapshot y setLoading(false) cuando termine la carga

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
