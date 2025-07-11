import { Order } from '../types';

/**
 * Interfaz para el contexto de órdenes.
 */
export interface OrdersContextType {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  fetchOrders: (filters?: { fromDate?: Date; toDate?: Date; ubicacionId?: string }) => Promise<void>;
  loading: boolean;
}
