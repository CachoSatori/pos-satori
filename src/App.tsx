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
import { DebugContextProvider, DebugUI } from './components/DebugContext';

/**
 * Componente Home: redirige a /login si no está autenticado, o a /dashboard si sí.
 */
function HomeRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);
  return null;
}

/**
 * Componente principal App.
 * Redirige Home según autenticación, integra DebugContext y DebugUI en /debug.
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
              <DebugContextProvider>
                <Routes>
                  <Route path="/" element={<HomeRedirect />} />
                  <Route path="/login" element={<Login />} />
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
                  <Route
                    path="/debug"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <DebugUI />
                      </ProtectedRoute>
                    }
                  />
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </DebugContextProvider>
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
 * - Redirige Home correctamente según autenticación.
 * - Renderiza DebugUI solo para admin en /debug.
 * - ErrorBoundary captura errores de contexto.
 * - Navegación accesible y mobile-first (<3 clics).
 * - Los textos y notificaciones se muestran traducidos según idioma.
 */