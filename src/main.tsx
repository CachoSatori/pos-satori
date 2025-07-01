import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Dashboard from './modules/dashboard/Dashboard';
import AdminProductos from './modules/admin/AdminProductos';
import AdminMesas from './modules/admin/AdminMesas';
import AdminOrders from './modules/admin/AdminOrders';
import Notifications from './modules/notifications/Notifications';
import Login from './modules/auth/Login';
import ProtectedRoute from './modules/auth/ProtectedRoute';
import NavBar from './components/NavBar';
import { AuthProvider } from './contexts/AuthContext';
import { ProductosProvider } from './contexts/ProductosContext';
import { MesasProvider } from './contexts/MesasContext';
import { OrdersProvider } from './contexts/OrdersContext';
import './index.css';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <AuthProvider>
      <ProductosProvider>
        <MesasProvider>
          <OrdersProvider>
            <BrowserRouter>
              <NavBar />
              <Routes>
                <Route path="/" element={<App />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminProductos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mesas"
                  element={
                    <ProtectedRoute>
                      <AdminMesas />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
              </Routes>
            </BrowserRouter>
          </OrdersProvider>
        </MesasProvider>
      </ProductosProvider>
    </AuthProvider>
  </StrictMode>
);