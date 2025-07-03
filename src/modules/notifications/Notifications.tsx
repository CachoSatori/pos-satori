import { useEffect, useState } from 'react';
import { useOrders } from '../../contexts/OrdersContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { requestFCMToken, onForegroundMessage, logError } from '../../firebase';

const Notifications: React.FC = () => {
  const { orders } = useOrders();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<{ id: string; message: string; time: string }[]>([]);

  // Listen for FCM push notifications
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user) {
      requestFCMToken()
        .then(token => {
          if (token) {
            toast.success('Notificaciones activadas');
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

  // Listen for new orders in real time
  useEffect(() => {
    if (!orders.length) return;
    const latestOrder = orders[orders.length - 1];
    setNotifications(prev => [
      {
        id: latestOrder.id,
        message: `Nueva orden de la mesa #${latestOrder.tableId} (${latestOrder.items.length} productos)`,
        time: new Date(latestOrder.createdAt).toLocaleTimeString(),
      },
      ...prev.filter(n => n.id !== latestOrder.id),
    ]);
    // eslint-disable-next-line
  }, [orders.length]);

  return (
    <div className="bg-primary text-text min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-accent">Notificaciones</h1>
      <div className="w-full max-w-2xl bg-secondary rounded-xl shadow-lg p-6">
        {notifications.length === 0 ? (
          <div className="text-center text-lg text-gray-400">Sin notificaciones recientes</div>
        ) : (
          <ul className="flex flex-col gap-4">
            {notifications.map(n => (
              <li
                key={n.id}
                className="bg-primary rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between"
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