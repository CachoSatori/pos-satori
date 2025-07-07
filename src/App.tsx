import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Login from './modules/auth/Login';
import ProtectedRoute from './modules/auth/ProtectedRoute';
import AdminMesas from './modules/admin/AdminMesas';
import AdminProductos from './modules/admin/AdminProductos';
import AdminOrders from './modules/admin/AdminOrders';
import Dashboard from './modules/dashboard/Dashboard';
import Reports from './modules/reports/Reports';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MesasProvider } from './contexts/MesasContext';
import { ProductosProvider } from './contexts/ProductosContext';
import { OrdersProvider } from './contexts/OrdersContext';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * Componente Home: redirige a /login.
 */
function HomeRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login', { replace: true });
  }, [navigate]);
  return null;
}

/**
 * Componente Navigation: muestra navegación tras login.
 * Mobile-first, accesible, y alineado a colores Lavu.
 */
function Navigation() {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <nav
      className="bg-primary text-text min-h-screen flex flex-col items-center justify-center gap-8"
      aria-label={t('Main Navigation')}
      style={{ background: '#1C2526' }}
    >
      <h1 className="text-4xl font-bold mb-8" style={{ color: '#00A6A6' }}>
        SatoriPOS
      </h1>
      <div className="flex flex-col gap-6 w-full max-w-xs">
        <NavButton to="/dashboard" label={t('Dashboard')} />
        <NavButton to="/orders" label={t('Order Administration')} />
        <NavButton to="/admin" label={t('Product Administration')} />
        <NavButton to="/mesas" label={t('Table Administration')} />
        <NavButton to="/reports" label={t('Sales Reports')} />
      </div>
    </nav>
  );
}

/**
 * Botón de navegación reutilizable.
 */
function NavButton({ to, label }: { to: string; label: string }) {
  return (
    <a
      href={to}
      className="bg-accent text-text px-8 py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-accent/80 transition text-center"
      aria-label={label}
      style={{ background: '#00A6A6', color: '#FFFFFF' }}
    >
      {label}
    </a>
  );
}

/**
 * Componente principal App.
 * Elimina logo en Home, redirige a /login, y muestra navegación tras login.
 * Envuelve rutas con ErrorBoundary y Providers.
 * Compatible con mobile-first, accesibilidad y modularidad.
 */
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MesasProvider>
          <ProductosProvider>
            <OrdersProvider>
              <Routes>
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/navigation" element={<Navigation />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminProductos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mesas"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'waiter']}>
                      <AdminMesas />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'waiter']}>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'waiter']}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'waiter']}>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </OrdersProvider>
          </ProductosProvider>
        </MesasProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

/**
 * Sugerencias de pruebas unitarias (Vitest):
 * - Renderiza Navigation solo si el usuario está autenticado.
 * - Redirige correctamente de Home a /login.
 * - Navegación accesible y mobile-first (<3 clics).
 * - ErrorBoundary captura errores de contexto.
 * - Los textos y notificaciones se muestran traducidos según idioma.
 */