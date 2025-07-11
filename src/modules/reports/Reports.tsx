import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import type { Order, Product } from '../../types';
import { useProductos } from '../../contexts/ProductosHook';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { useOrders } from '../../contexts/OrdersHook';

/**
 * Componente para mostrar reportes de ventas.
 */
const Reports: React.FC = () => {
  const { t } = useTranslation();
  const { orders, fetchOrders } = useOrders();
  const [loading, setLoading] = useState(true);
  const { products } = useProductos();
  const [fromDate, setFromDate] = useState<Date>(
    new Date(new Date().setDate(1))
  );
  const [toDate, setToDate] = useState<Date>(new Date());
  const [ubicacionId, setUbicacionId] = useState<string>('');
  const [ubicaciones, setUbicaciones] = useState<
    { id: string; nombre: string }[]
  >([]);

  // Fetch ubicaciones desde Firestore (ajusta si tienes context)
  useEffect(() => {
    const fetchUbicaciones = async () => {
      const snapshot = await getDocs(collection(db, 'ubicaciones'));
      setUbicaciones(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any))
      );
    };
    fetchUbicaciones();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchOrders({ fromDate, toDate, ubicacionId });
    setLoading(false);
  }, [fromDate, toDate, ubicacionId, fetchOrders]);

  // Calcula el total de una orden
  const getOrderTotal = (order: Order) =>
    order.items.reduce((acc, item) => {
      const product = products.find((p: Product) => p.id === item.productId);
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);

  // Total de ventas
  const totalSales = orders.reduce(
    (sum, order) => sum + getOrderTotal(order),
    0
  );

  const total = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="min-h-screen p-8 bg-[#1C2526] text-[#FFFFFF]">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#00A6A6]">
        {t('reports.title', 'Sales Reports')}
      </h1>
      {loading ? (
        <div>{t('reports.loading', 'Loading...')}</div>
      ) : (
        <>
          <div className="mb-6 text-2xl">
            {t('reports.totalSales', 'Total Sales')}: <span className="font-bold">${totalSales.toFixed(2)}</span>
          </div>
          <div className="flex gap-4 mb-4 flex-wrap">
            <div>
              <label className="block text-sm">
                {t('reports.from', 'Desde')}
              </label>
              <DatePicker
                selected={fromDate}
                onChange={(date) => date && setFromDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm">
                {t('reports.to', 'Hasta')}
              </label>
              <DatePicker
                selected={toDate}
                onChange={(date) => date && setToDate(date)}
                dateFormat="yyyy-MM-dd"
                className="border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm">
                {t('reports.location', 'Ubicación')}
              </label>
              <select
                value={ubicacionId}
                onChange={(e) => setUbicacionId(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">{t('reports.all_locations', 'Todas')}</option>
                {ubicaciones.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre || u.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p data-testid="total">
            {t('reports.total')}: {total}
          </p>
          {/* Test manual: Cambiar idioma y verificar traducción */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#23272b] text-white rounded">
              <thead>
                <tr>
                  <th className="px-2 py-1">{t('reports.date', 'Fecha')}</th>
                  <th className="px-2 py-1">
                    {t('reports.location', 'Ubicación')}
                  </th>
                  <th className="px-2 py-1">{t('reports.total', 'Total')}</th>
                  {/* Agrega más columnas si es necesario */}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-2 py-1">
                      {order.date
                        ? format(new Date(order.date), 'yyyy-MM-dd')
                        : ''}
                    </td>
                    <td className="px-2 py-1">{order.ubicacionId || '-'}</td>
                    <td className="px-2 py-1">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;

/**
 * Sugerencias de pruebas (Vitest):
 * - Renderiza tabla de órdenes y ventas totales.
 * - Muestra loading correctamente.
 * - Accesibilidad: tabla con encabezados.
 */
