import React from 'react';
import ReactDOM from 'react-dom/client';
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
import { ProductosProvider } from './contexts/ProductosContext.tsx';
import { MesasProvider } from './contexts/MesasContext.tsx';
import { OrdersProvider } from './contexts/OrdersContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <MesasProvider>
        <OrdersProvider>
          <ProductosProvider>
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
          </ProductosProvider>
        </OrdersProvider>
      </MesasProvider>
    </AuthProvider>
  </React.StrictMode>
);