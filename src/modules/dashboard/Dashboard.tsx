import React from 'react';
import { Link } from 'react-router-dom';
import { useProductos } from '../../contexts/ProductosHook';
import { useMesas } from '../../contexts/MesasHook';
import { useOrders } from '../../contexts/OrdersHook';
import { useAuth } from '../../contexts/AuthHook';
import ProtectedRoute from '../auth/ProtectedRoute';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import type { Order, OrderItem } from '../../types';
import type { Timestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

/**
 * Componente de dashboard.
 * Muestra métricas de productos, mesas y órdenes.
 */
const Dashboard: React.FC = () => {
  useAuth();
  const { products, loading: loadingProducts } = useProductos();
  const { tables, loading: loadingTables } = useMesas();
  const { orders, loading: loadingOrders } = useOrders();
  const { t } = useTranslation();

  // Filtrar órdenes completadas
  const completedOrders = orders.filter((order: Order) => order.status === 'completed');

  // Calcular ingresos totales
  const totalRevenue = completedOrders.reduce(
    (sum: number, order: Order) =>
      sum +
      order.items.reduce(
        (orderSum: number, item: OrderItem) => {
          const product = products.find(p => p.id === item.productId);
          return orderSum + ((product?.price ?? 0) * item.quantity);
        },
        0
      ),
    0
  );

  // Contar órdenes por estado
  const statusCounts = orders.reduce(
    (acc: Record<string, number>, order: Order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    { pending: 0, in_progress: 0, completed: 0, cancelled: 0 }
  );

  const statusPieData = {
    labels: ['Pendiente', 'En Progreso', 'Completada', 'Cancelada'],
    datasets: [
      {
        data: [
          statusCounts.pending,
          statusCounts.in_progress,
          statusCounts.completed,
          statusCounts.cancelled,
        ],
        backgroundColor: ['#FFD600', '#FFA600', '#00A6A6', '#EF4444'],
        borderColor: ['#FFD600', '#FFA600', '#00A6A6', '#EF4444'],
        borderWidth: 1,
      },
    ],
  };

  // Últimos 7 días
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Calcular ingresos por día
  const revenueByDay = days.map(day => {
    const dayStr = day.toISOString().slice(0, 10);
    const dayOrders = completedOrders.filter((order: Order) => {
      if (!order.createdAt) return false;
      let orderDate: Date;
      if (typeof order.createdAt === 'object' && 'toDate' in order.createdAt) {
        orderDate = (order.createdAt as Timestamp).toDate();
      } else {
        orderDate = new Date(order.createdAt);
      }
      return orderDate.toISOString().slice(0, 10) === dayStr;
    });
    return dayOrders.reduce(
      (sum: number, order: Order) =>
        sum +
        order.items.reduce(
          (orderSum: number, item: OrderItem) => {
            const product = products.find(p => p.id === item.productId);
            return orderSum + ((product?.price ?? 0) * item.quantity);
          },
          0
        ),
      0
    );
  });

  const revenueBarData = {
    labels: days.map(d =>
      d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Ingresos',
        data: revenueByDay,
        backgroundColor: '#00A6A6',
        borderRadius: 8,
      },
    ],
  };

  if (loadingProducts || loadingTables || loadingOrders) {
    return (
      <div className="bg-[#1C2526] text-[#FFFFFF] min-h-screen flex items-center justify-center">
        <span className="text-xl">Cargando resumen...</span>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'waiter']}>
      <div className="bg-[#1C2526] text-[#FFFFFF] min-h-screen flex items-center justify-center p-8">
        <div className="bg-[#16213e] rounded-xl shadow-lg p-8 flex flex-col gap-8 items-center w-full max-w-5xl">
          <h1 className="text-4xl font-bold mb-4 text-center text-[#00A6A6]">{t('Dashboard')}</h1>
          <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
            <div className="flex-1 bg-[#1C2526] rounded-xl shadow p-8 flex flex-col items-center">
              <span className="text-[#00A6A6] text-5xl font-bold mb-2">{products.length}</span>
              <span className="text-lg font-semibold mb-4">{t('Products')}</span>
              <Link
                to="/admin"
                style={{
                  padding: '16px',
                  fontSize: '18px',
                  borderRadius: '8px',
                  backgroundColor: '#00A6A6',
                  color: '#FFFFFF',
                  border: '1px solid #00A6A6',
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px #1C2526',
                  marginTop: '16px'
                }}
              >
                {t('View Products')}
              </Link>
            </div>
            <div className="flex-1 bg-[#1C2526] rounded-xl shadow p-8 flex flex-col items-center">
              <span className="text-[#00A6A6] text-5xl font-bold mb-2">{tables.length}</span>
              <span className="text-lg font-semibold mb-4">{t('Tables')}</span>
              <Link
                to="/mesas"
                style={{
                  padding: '16px',
                  fontSize: '18px',
                  borderRadius: '8px',
                  backgroundColor: '#00A6A6',
                  color: '#FFFFFF',
                  border: '1px solid #00A6A6',
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px #1C2526',
                  marginTop: '16px'
                }}
              >
                {t('View Tables')}
              </Link>
            </div>
            <div className="flex-1 bg-[#1C2526] rounded-xl shadow p-8 flex flex-col items-center">
              <span className="text-[#00A6A6] text-5xl font-bold mb-2">{orders.length}</span>
              <span className="text-lg font-semibold mb-1">{t('Orders')}</span>
              <span className="text-[#FFFFFF] text-lg mb-4">
                {t('Completed')}: <span className="font-bold text-[#00A6A6]">{statusCounts.completed}</span>
              </span>
              <Link
                to="/orders"
                style={{
                  padding: '16px',
                  fontSize: '18px',
                  borderRadius: '8px',
                  backgroundColor: '#00A6A6',
                  color: '#FFFFFF',
                  border: '1px solid #00A6A6',
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px #1C2526',
                  marginTop: '16px'
                }}
              >
                {t('View Orders')}
              </Link>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-8 justify-center mt-8">
            <div className="flex-1 bg-[#1C2526] rounded-xl shadow p-8 flex flex-col items-center">
              <span className="text-lg font-semibold mb-2">{t('Total Revenue')}</span>
              <span className="text-3xl font-bold text-[#00A6A6] mb-2">
                ${totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <div className="w-full mt-6">
                <Bar
                  data={revenueBarData}
                  options={{
                    plugins: { legend: { display: false } },
                    responsive: true,
                    scales: {
                      y: { beginAtZero: true, ticks: { color: '#fff' } },
                      x: { ticks: { color: '#fff' } }
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex-1 bg-[#1C2526] rounded-xl shadow p-8 flex flex-col items-center">
              <span className="text-lg font-semibold mb-4">{t('Orders by Status')}</span>
              <div className="w-full max-w-xs">
                <Pie
                  data={statusPieData}
                  options={{
                    plugins: {
                      legend: {
                        labels: { color: '#fff', font: { size: 16 } }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;

/**
 * Sugerencias de pruebas (Vitest):
 * - Renderiza loading correctamente.
 * - Renderiza lista de órdenes.
 * - Accesibilidad: aria-busy y roles correctos.
 */