import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, onSnapshot, enablePersistence } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../services/firebase';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  tableId: string;
  status: string;
  items: OrderItem[];
  createdAt?: any;
}

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
}

const OrdersContext = createContext<OrdersContextType>({ orders: [], loading: false });

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    enablePersistence(db).catch((error) => {
      toast.error('Error al habilitar persistencia offline');
      console.error(error);
    });

    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      try {
        const ordersData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            tableId: data.tableId || '',
            status: data.status || 'pending',
            items: Array.isArray(data.items) ? data.items : [],
            createdAt: data.createdAt,
          } as Order;
        });
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        toast.error('Error al cargar órdenes');
        console.error(error);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, loading }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);