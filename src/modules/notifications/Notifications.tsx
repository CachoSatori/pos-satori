import { useEffect, useState } from 'react';
import { useOrders } from '../../contexts/OrdersContext';
import { useAuth } from '../../contexts/useAuth';
import { toast } from 'react-toastify';
import { requestFCMToken, onForegroundMessage, logError } from '../../firebase';
import type { Order } from '../../types';
import type { Timestamp } from 'firebase/firestore';

const Notifications: React.FC = () => {
  const { orders } = useOrders();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<{ id: string; message: string; time: string }[]>([]);

  // Solicitar permiso y token FCM al iniciar sesión
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user) {
      requestFCMToken()
        .then(token => {
          if (token) {
            toast.success('Notificaciones push activadas');
          }
        })
        .catch((error: unknown) => {
          toast.error('No se pudo activar notificaciones');
          if (error instanceof Error) {
            logError(error);
          } else {
            logError(new Error(JSON.stringify(error)));
          }
        });

      unsubscribe = onForegroundMessage((payload: { notification?: { body?: string } }) => {
        const { notification } = payload;
        setNotifications(prev => [
          {
            id: Date.now().toString(),
            message: notification?.body || 'Nueva notificación',
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
        toast.info(notification?.body || 'Nueva notificación');
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Notificación local para nuevas órdenes usando Order.createdAt como Timestamp
  useEffect(() => {
    if (!orders.length) return;
    const latestOrder: Order = orders[orders.length - 1];
    let createdAtTime = '';
    if (latestOrder.createdAt && typeof latestOrder.createdAt === 'object' && 'toDate' in latestOrder.createdAt) {
      createdAtTime = (latestOrder.createdAt as Timestamp).toDate().toLocaleTimeString();
    } else if (typeof latestOrder.createdAt === 'number') {
      createdAtTime = new Date(latestOrder.createdAt).toLocaleTimeString();
    } else {
      createdAtTime = new Date().toLocaleTimeString();
    }
    setNotifications(prev => [
      {
        id: latestOrder.id,
        message: `Nueva orden de la mesa #${latestOrder.tableId} (${latestOrder.items.length} productos)`,
        time: createdAtTime,
      },
      ...prev.filter(n => n.id !== latestOrder.id),
    ]);
    // eslint-disable-next-line
  }, [orders.length]);

  return (
    <div className="bg-[#1C2526] text-[#FFFFFF] min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-[#00A6A6]">Notificaciones</h1>
      <div className="w-full max-w-2xl bg-[#16213e] rounded-xl shadow-lg p-6">
        {notifications.length === 0 ? (
          <div className="text-center text-lg text-gray-400">Sin notificaciones recientes</div>
        ) : (
          <ul className="flex flex-col gap-4">
            {notifications.map(n => (
              <li
                key={n.id}
                className="bg-[#1C2526] rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <span className="font-semibold">{n.message}</span>
                <span className="text-sm text-gray-400 mt-2 md:mt-0">{n.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;