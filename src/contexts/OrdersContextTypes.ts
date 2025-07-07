export interface OrdersContextType {
  orders: any[];
  setOrders: (orders: any[]) => void;
  loading: boolean;
}