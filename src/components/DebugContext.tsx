import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onSnapshot, collection, FirestoreError } from 'firebase/firestore';
import { db } from '../firebase';
import { logError } from '../firebase';
import { useAuth } from '../contexts/AuthHook';
import { useOrders } from '../contexts/OrdersHook';
import { useProductos } from '../contexts/ProductosHook';
import { useMesas } from '../contexts/MesasHook';
import { useTranslation } from 'react-i18next';

interface DebugContextType {
  ordersError: string | null;
  productsError: string | null;
  tablesError: string | null;
}

export const DebugContext = createContext<DebugContextType | undefined>(
  undefined
);

export const DebugProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [tablesError, setTablesError] = useState<string | null>(null);

  useEffect(() => {
    const ordersUnsub = onSnapshot(
      collection(db, 'orders'),
      () => {},
      (error) => {
        const details = `Código: ${(error as FirestoreError).code || 'N/A'}, Mensaje: ${(error as FirestoreError).message || 'N/A'}, User: ${user?.email || 'N/A'}`;
        logError({
          error,
          context: 'OrdersContext',
          details: `User: ${user?.email || 'N/A'}`,
        });
        setOrdersError(details);
      }
    );

    const productsUnsub = onSnapshot(
      collection(db, 'products'),
      () => {},
      (error) => {
        const details = `Código: ${(error as FirestoreError).code || 'N/A'}, Mensaje: ${(error as FirestoreError).message || 'N/A'}, User: ${user?.email || 'N/A'}`;
        logError({
          error,
          context: 'ProductosContext',
          details: `User: ${user?.email || 'N/A'}`,
        });
        setProductsError(details);
      }
    );

    const tablesUnsub = onSnapshot(
      collection(db, 'tables'),
      () => {},
      (error) => {
        const details = `Código: ${(error as FirestoreError).code || 'N/A'}, Mensaje: ${(error as FirestoreError).message || 'N/A'}, User: ${user?.email || 'N/A'}`;
        logError({
          error,
          context: 'MesasContext',
          details: `User: ${user?.email || 'N/A'}`,
        });
        setTablesError(details);
      }
    );

    return () => {
      ordersUnsub();
      productsUnsub();
      tablesUnsub();
    };
  }, [user]);

  return (
    <DebugContext.Provider value={{ ordersError, productsError, tablesError }}>
      {children}
    </DebugContext.Provider>
  );
};

/**
 * Props para DebugContextProvider.
 */
interface DebugContextProviderProps {
  children: ReactNode;
}

/**
 * Componente DebugContextProvider.
 * Monitorea y muestra el estado de OrdersContext, ProductosContext y MesasContext.
 * Registra errores en consola solo en desarrollo y en Firestore. Accesible y mobile-first.
 */
export const DebugContextProvider: React.FC<DebugContextProviderProps> = ({
  children,
}) => {
  const { orders, loading: loadingOrders } = useOrders();
  const { products, loading: loadingProducts } = useProductos();
  const { mesas, loading: loadingTables } = useMesas();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Evitar warning de no-unused-vars para t
  void t;

  useEffect(() => {
    if (!user) return;
    if (loadingOrders || loadingProducts || loadingTables) return;

    if (orders.length === 0) {
      const error = new Error('OrdersContext vacío tras carga');
      logError({
        error,
        context: 'OrdersContext',
        details: `User: ${user?.email || 'N/A'}`,
      });
      if (import.meta.env.MODE === 'development')
        window.console?.warn?.('[DebugContext] OrdersContext vacío');
    }
    if (products.length === 0) {
      const error = new Error('ProductosContext vacío tras carga');
      logError({
        error,
        context: 'ProductosContext',
        details: `User: ${user?.email || 'N/A'}`,
      });
      if (import.meta.env.MODE === 'development')
        window.console?.warn?.('[DebugContext] ProductosContext vacío');
    }
    if (mesas.length === 0) {
      const error = new Error('MesasContext vacío tras carga');
      logError({
        error,
        context: 'MesasContext',
        details: `User: ${user?.email || 'N/A'}`,
      });
      if (import.meta.env.MODE === 'development')
        window.console?.warn?.('[DebugContext] MesasContext vacío');
    }
  }, [
    orders,
    products,
    mesas,
    loadingOrders,
    loadingProducts,
    loadingTables,
    user,
  ]);

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
  const { mesas, loading: loadingTables } = useMesas();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Evitar warning de no-unused-vars para t
  void t;

  // Definir tipo seguro para user con role
  const isAdmin =
    user && typeof (user as { role?: string }).role === 'string'
      ? (user as { role?: string }).role === 'admin'
      : false;

  if (!isAdmin) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        aria-live="polite"
      >
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
          <span className="font-bold">{t('Loading')}:</span>{' '}
          {loadingOrders ? t('Yes') : t('No')}
          <pre
            className="mt-2 text-xs overflow-x-auto"
            aria-label={t('Orders data')}
          >
            {JSON.stringify(orders, null, 2)}
          </pre>
        </div>
        <h2 className="text-xl font-bold mb-2">{t('ProductosContext')}</h2>
        <div className="bg-secondary rounded p-4 mb-4">
          <span className="font-bold">{t('Loading')}:</span>{' '}
          {loadingProducts ? t('Yes') : t('No')}
          <pre
            className="mt-2 text-xs overflow-x-auto"
            aria-label={t('Products data')}
          >
            {JSON.stringify(products, null, 2)}
          </pre>
        </div>
        <h2 className="text-xl font-bold mb-2">{t('MesasContext')}</h2>
        <div className="bg-secondary rounded p-4">
          <span className="font-bold">{t('Loading')}:</span>{' '}
          {loadingTables ? t('Yes') : t('No')}
          <pre
            className="mt-2 text-xs overflow-x-auto"
            aria-label={t('Tables data')}
          >
            {JSON.stringify(mesas, null, 2)}
          </pre>
        </div>
      </section>
      <div className="text-xs text-accent mt-8">
        {t('Only visible to admin users')}
      </div>
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
