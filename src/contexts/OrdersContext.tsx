import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
     import { collection, onSnapshot, enablePersistence } from 'firebase/firestore';
     import { toast } from 'react-toastify';
     import { db } from '../services/firebase';

     interface Order {
       id: string;
       tableId: string;
       products: { productId: string; quantity: number }[];
       status: 'pending' | 'completed' | 'cancelled';
       createdAt: string;
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
             const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
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