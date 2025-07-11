import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Login from './modules/auth/Login'; // No lazy si es ligero
import ProtectedRoute from './modules/auth/ProtectedRoute'; // Auth wrapper según SDD
import AdminMesas from './modules/admin/AdminMesas';
import AdminProductos from './modules/admin/AdminProductos';
import AdminOrders from './modules/admin/AdminOrders';
import Reports from './modules/reports/Reports';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthHook';
import { MesasProvider } from './contexts/MesasContext';
import { ProductosProvider } from './contexts/ProductosContext';
import { OrdersProvider } from './contexts/OrdersContext';
import { DebugContextProvider, DebugUI } from './components/DebugContext';
import ErrorBoundary from './components/ErrorBoundary';

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
  // Evitar warning de no-unused-vars para useTranslation
  void useTranslation;

  const LazyDashboard = lazy(() => import('./modules/dashboard/Dashboard'));

  return (
    <ErrorBoundary>
      <AuthProvider>
        <MesasProvider>
          <ProductosProvider>
            <OrdersProvider>
              <DebugContextProvider>
                <Router>
                  <div className="min-h-screen bg-[#1C2526] text-[#FFFFFF]">
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
                            <Suspense fallback={<div>Loading Dashboard...</div>}>
                              <LazyDashboard />
                            </Suspense>
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
                      {/* Redirige cualquier ruta desconocida a /login */}
                      <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                  </div>
                </Router>
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
