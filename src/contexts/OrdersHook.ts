import { useContext } from 'react';
import { OrdersContext } from './OrdersContext';
import type { OrdersContextType } from './OrdersContextTypes';

export function useOrders(): OrdersContextType {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders debe usarse dentro de OrdersProvider');
  }
  return context;
}