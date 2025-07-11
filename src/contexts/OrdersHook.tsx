import { useContext } from 'react';
import { OrdersContext } from './OrdersContext';
<<<<<<< HEAD
import { OrdersContextType } from './OrdersContextTypes';

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error('useOrders must be used within OrdersProvider');
  return context;
};
=======
import type { OrdersContextType } from './OrdersContextTypes';

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
>>>>>>> e7873d4861da77c7c58f9e0232b79d7ff80eeabd
