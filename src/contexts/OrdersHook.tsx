import { useContext } from 'react';
import { OrdersContext } from './OrdersContext';
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