import type { Order } from '../types';

/**
 * Interfaz para el contexto de órdenes.
 */
export interface OrdersContextType {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  loading: boolean;
}