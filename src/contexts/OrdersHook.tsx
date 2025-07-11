import { useContext } from 'react';
import { OrdersContext } from './OrdersContext';
import { OrdersContextType } from './OrdersContextTypes';

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error('useOrders must be used within OrdersProvider');
  return context;
};
