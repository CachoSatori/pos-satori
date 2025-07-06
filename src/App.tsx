import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from './assets/LOGO.jpg';
import Login from './modules/auth/Login';
import ProtectedRoute from './modules/auth/ProtectedRoute';
import AdminMesas from './modules/admin/AdminMesas';
import AdminProductos from './modules/admin/AdminProductos';
import AdminOrders from './modules/admin/AdminOrders';
import Dashboard from './modules/dashboard/Dashboard';
import Reports from './modules/reports/Reports';
import { AuthProvider } from './contexts/AuthContext';
import { MesasProvider } from './contexts/MesasContext';
import { ProductosProvider } from './contexts/ProductosContext';
import { OrdersProvider } from './contexts/OrdersContext';
import ErrorBoundary from './components/ErrorBoundary';

function Home() {
  const { t } = useTranslation();
  return (
    <div
      className="bg-primary text-text min-h-screen p-8 flex flex-col items-center justify-center touch-manipulation"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div className="absolute inset-0 bg-primary bg-opacity-80 pointer-events-none" />
      <div className="relative z-10 bg-secondary rounded-xl shadow-lg flex flex-col items-center p-12">
        <h1 className="text-5xl font-bold mb-6 text-center drop-shadow">SatoriPOS - {t('Home')}</h1>
        <p className="text-xl mb-10 text-center">{t('Project running')}</p>
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <Link
            to="/admin"
            className="bg-accent text-text px-10 py-5 rounded-xl font-bold text-2xl shadow-lg hover:bg-accent/80 transition w-full md:w-auto text-center"
          >
            {t('Product Administration')}
          </Link>
          <Link
            to="/mesas"
            className="bg-accent text-text px-10 py-5 rounded-xl font-bold text-2xl shadow-lg hover:bg-accent/80 transition w-full md:w-auto text-center"
          >
            {t('Table Administration')}
          </Link>
          <Link
            to="/orders"
            className="bg-accent text-text px-10 py-5 rounded-xl font-bold text-2xl shadow-lg hover:bg-accent/80 transition w-full md:w-auto text-center"
          >
            {t('Order Administration')}
          </Link>
          <Link
            to="/dashboard"
            className="bg-accent text-text px-10 py-5 rounded-xl font-bold text-2xl shadow-lg hover:bg-accent/80 transition w-full md:w-auto text-center"
          >
            {t('Dashboard')}
          </Link>
          <Link
            to="/reports"
            className="bg-accent text-text px-10 py-5 rounded-xl font-bold text-2xl shadow-lg hover:bg-accent/80 transition w-full md:w-auto text-center"
          >
            {t('Sales Reports')}
          </Link>
          <Link
            to="/login"
            className="bg-accent text-text px-10 py-5 rounded-xl font-bold text-2xl shadow-lg hover:bg-accent/80 transition w-full md:w-auto text-center"
          >
            {t('Login')}
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <MesasProvider>
            <ProductosProvider>
              <OrdersProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  {/* Ruta protegida para administración de productos (solo admin) */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminProductos />
                      </ProtectedRoute>
                    }
                  />
                  {/* Ruta protegida para administración de mesas (admin y waiter) */}
                  <Route
                    path="/mesas"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'waiter']}>
                        <AdminMesas />
                      </ProtectedRoute>
                    }
                  />
                  {/* Ruta protegida para administración de órdenes (admin y waiter) */}
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'waiter']}>
                        <AdminOrders />
                      </ProtectedRoute>
                    }
                  />
                  {/* Ruta protegida para dashboard (admin y waiter) */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'waiter']}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  {/* Ruta protegida para reportes (admin y waiter) */}
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
    </BrowserRouter>
  );
}

export default App;