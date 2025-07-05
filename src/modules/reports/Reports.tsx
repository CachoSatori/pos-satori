import { useMemo } from 'react';
import { useOrders } from '../../contexts/OrdersContext';
import { useProductos } from '../../contexts/ProductosContext';
import { useMesas } from '../../contexts/MesasContext';
import { useAuth } from '../../contexts/useAuth';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from '../auth/ProtectedRoute';
import type { Order, OrderItem, Product, Table } from '../../types';
import type { Timestamp } from 'firebase/firestore';

const LAVU_BG = '#1C2526';
const LAVU_ACCENT = '#00A6A6';
const LAVU_TEXT = '#FFFFFF';

function formatDate(ts: Timestamp | Date | string, locale: string): string {
  let date: Date;
  if (typeof ts === 'object' && ts !== null && 'toDate' in ts) {
    date = (ts as Timestamp).toDate();
  } else if (typeof ts === 'string' || typeof ts === 'number') {
    date = new Date(ts);
  } else {
    date = ts as Date;
  }
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

const Reports: React.FC = () => {
  useAuth();
  const { t, i18n } = useTranslation();
  const { orders, loading: loadingOrders } = useOrders();
  const { products, loading: loadingProducts } = useProductos();
  const { tables, loading: loadingTables } = useMesas();

  // Filtrar solo órdenes completadas
  const completedOrders = useMemo(
    () => orders.filter((order: Order) => order.status === 'completed'),
    [orders]
  );

  // Ventas por día
  const salesByDay = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    completedOrders.forEach(order => {
      const dateStr = formatDate(order.createdAt, i18n.language);
      let total = 0;
      order.items.forEach(item => {
        const product = products.find(p => p.id === (item as any).productId || (item as any).product?.id);
        total += (product?.price ?? 0) * item.quantity;
      });
      if (!map.has(dateStr)) {
        map.set(dateStr, { total, count: 1 });
      } else {
        const prev = map.get(dateStr)!;
        map.set(dateStr, { total: prev.total + total, count: prev.count + 1 });
      }
    });
    return Array.from(map.entries()).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
  }, [completedOrders, products, i18n.language]);

  // Ventas por categoría
  const salesByCategory = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === (item as any).productId || (item as any).product?.id);
        if (!product) return;
        const cat = product.category || t('No data');
        if (!map.has(cat)) {
          map.set(cat, { total: product.price * item.quantity, count: item.quantity });
        } else {
          const prev = map.get(cat)!;
          map.set(cat, {
            total: prev.total + product.price * item.quantity,
            count: prev.count + item.quantity,
          });
        }
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1].total - a[1].total);
  }, [completedOrders, products, t]);

  // Ventas por producto
  const salesByProduct = useMemo(() => {
    const map = new Map<string, { name: string; total: number; count: number }>();
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === (item as any).productId || (item as any).product?.id);
        if (!product) return;
        if (!map.has(product.id)) {
          map.set(product.id, { name: product.name, total: product.price * item.quantity, count: item.quantity });
        } else {
          const prev = map.get(product.id)!;
          map.set(product.id, {
            name: product.name,
            total: prev.total + product.price * item.quantity,
            count: prev.count + item.quantity,
          });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [completedOrders, products]);

  if (loadingOrders || loadingProducts || loadingTables) {
    return (
      <div style={{ background: LAVU_BG, color: LAVU_TEXT }} className="min-h-screen flex items-center justify-center">
        <span className="text-xl">{t('Loading...')}</span>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'waiter']}>
      <div style={{ background: LAVU_BG, color: LAVU_TEXT }} className="min-h-screen p-8">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: LAVU_ACCENT }}>
          {t('Sales Reports')}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ventas por día */}
          <div className="bg-[#16213e] rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: LAVU_ACCENT }}>{t('Sales by Day')}</h2>
            <ul>
              {salesByDay.length === 0 && (
                <li className="text-gray-400">{t('No sales recorded')}</li>
              )}
              {salesByDay.map(([date, { total, count }]) => (
                <li key={date} className="mb-2 flex justify-between">
                  <span>{date}</span>
                  <span>
                    <span className="font-bold">${total.toLocaleString(i18n.language, { minimumFractionDigits: 2 })}</span>
                    <span className="ml-2 text-sm text-gray-400">
                      ({count} {t('orders')})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Ventas por categoría */}
          <div className="bg-[#16213e] rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: LAVU_ACCENT }}>{t('Sales by Category')}</h2>
            <ul>
              {salesByCategory.length === 0 && (
                <li className="text-gray-400">{t('No sales recorded')}</li>
              )}
              {salesByCategory.map(([cat, { total, count }]) => (
                <li key={cat} className="mb-2 flex justify-between">
                  <span>{cat}</span>
                  <span>
                    <span className="font-bold">${total.toLocaleString(i18n.language, { minimumFractionDigits: 2 })}</span>
                    <span className="ml-2 text-sm text-gray-400">
                      ({count} {t('products')})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Ventas por producto */}
          <div className="bg-[#16213e] rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: LAVU_ACCENT }}>{t('Sales by Product')}</h2>
            <ul>
              {salesByProduct.length === 0 && (
                <li className="text-gray-400">{t('No sales recorded')}</li>
              )}
              {salesByProduct.map(({ name, total, count }) => (
                <li key={name} className="mb-2 flex justify-between">
                  <span>{name}</span>
                  <span>
                    <span className="font-bold">${total.toLocaleString(i18n.language, { minimumFractionDigits: 2 })}</span>
                    <span className="ml-2 text-sm text-gray-400">
                      ({count} {t('sold')})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Reports;