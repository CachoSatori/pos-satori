import type { Order } from '../types/Order';

export interface OrdersContextType {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  loading: boolean;
}