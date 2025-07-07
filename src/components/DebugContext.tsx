import React, { ReactNode, useEffect } from 'react';
import { useOrders } from '../contexts/OrdersContext';
import { useProductos } from '../contexts/ProductosContext';
import { useMesas } from '../contexts/MesasContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { logError } from '../firebase';

/**
 * Props para DebugContextProvider.
 */
interface DebugContextProviderProps {
  children: ReactNode;
}

/**
 * Componente DebugContextProvider.
 * Monitorea y muestra el estado de OrdersContext, ProductosContext y MesasContext.
 * Registra errores en consola y Firestore. Accesible y mobile-first.
 */
export const DebugContextProvider: React.FC<DebugContextProviderProps> = ({ children }) => {
  const { orders, loading: loadingOrders } = useOrders();
  const { products, loading: loadingProducts } = useProductos();
  const { tables, loading: loadingTables } = useMesas();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Evitar warning de no-unused-vars para t
  void t;

  useEffect(() => {
    if (!user) return;
    if (loadingOrders || loadingProducts || loadingTables) return;

    if (orders.length === 0) {
      const error = new Error('OrdersContext vacío tras carga');
      logError({ error, context: 'OrdersContext', user: user.email });
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('[DebugContext] OrdersContext vacío');
      }
    }
    if (products.length === 0) {
      const error = new Error('ProductosContext vacío tras carga');
      logError({ error, context: 'ProductosContext', user: user.email });
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('[DebugContext] ProductosContext vacío');
      }
    }
    if (tables.length === 0) {
      const error = new Error('MesasContext vacío tras carga');
      logError({ error, context: 'MesasContext', user: user.email });
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('[DebugContext] MesasContext vacío');
      }
    }
  }, [orders, products, tables, loadingOrders, loadingProducts, loadingTables, user]);

  return <>{children}</>;
};

/**
 * Componente DebugUI.
 * Muestra el estado de los contextos y errores para admins en /debug.
 * Accesible, mobile-first y alineado a colores Lavu.
 */
export const DebugUI: React.FC = () => {
  const { orders, loading: loadingOrders } = useOrders();
  const { products, loading: loadingProducts } = useProductos();
  const { tables, loading: loadingTables } = useMesas();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Evitar warning de no-unused-vars para t
  void t;

  // Evitar no-explicit-any: se recomienda definir un tipo User con role
  const isAdmin = user && typeof (user as { role?: string }).role === 'string'
    ? (user as { role?: string }).role === 'admin'
    : false;

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen" aria-live="polite">
        <span className="text-accent text-xl">{t('Access denied')}</span>
      </div>
    );
  }

  return (
    <main
      className="bg-primary text-text min-h-screen p-6 flex flex-col items-center"
      style={{ background: '#1C2526', color: '#FFFFFF' }}
      aria-label={t('Debug Context State')}
    >
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#00A6A6' }}>
        {t('Debug Context State')}
      </h1>
      <section className="w-full max-w-2xl mb-8">
        <h2 className="text-xl font-bold mb-2">{t('OrdersContext')}</h2>
        <div className="bg-secondary rounded p-4 mb-4">
          <span className="font-bold">{t('Loading')}:</span> {loadingOrders ? t('Yes') : t('No')}
          <pre className="mt-2 text-xs overflow-x-auto" aria-label={t('Orders data')}>
            {JSON.stringify(orders, null, 2)}
          </pre>
        </div>
        <h2 className="text-xl font-bold mb-2">{t('ProductosContext')}</h2>
        <div className="bg-secondary rounded p-4 mb-4">
          <span className="font-bold">{t('Loading')}:</span> {loadingProducts ? t('Yes') : t('No')}
          <pre className="mt-2 text-xs overflow-x-auto" aria-label={t('Products data')}>
            {JSON.stringify(products, null, 2)}
          </pre>
        </div>
        <h2 className="text-xl font-bold mb-2">{t('MesasContext')}</h2>
        <div className="bg-secondary rounded p-4">
          <span className="font-bold">{t('Loading')}:</span> {loadingTables ? t('Yes') : t('No')}
          <pre className="mt-2 text-xs overflow-x-auto" aria-label={t('Tables data')}>
            {JSON.stringify(tables, null, 2)}
          </pre>
        </div>
      </section>
      <div className="text-xs text-accent mt-8">{t('Only visible to admin users')}</div>
    </main>
  );
};

export default DebugContextProvider;

/**
 * Sugerencias de pruebas (Vitest):
 * - Renderiza DebugUI solo para usuarios admin.
 * - Muestra correctamente los estados loading y datos de contextos.
 * - Registra errores en consola y llama a logError si los contextos están vacíos tras cargar.
 * - Accesibilidad: aria-labels y aria-live presentes.
 */