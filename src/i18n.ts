import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      // General
      'Loading...': 'Cargando...',
      'No data': 'Sin datos',
      // AdminProductos
      'Product Administration': 'Administración de Productos',
      'Add Product': 'Agregar Producto',
      'Edit Product': 'Editar Producto',
      'Delete Product': 'Eliminar Producto',
      'Product Name': 'Nombre del Producto',
      Price: 'Precio',
      Category: 'Categoría',
      Actions: 'Acciones',
      // AdminMesas
      'Table Administration': 'Administración de Mesas',
      'Add Table': 'Agregar Mesa',
      'Edit Table': 'Editar Mesa',
      'Delete Table': 'Eliminar Mesa',
      'Table Number': 'Número de Mesa',
      Status: 'Estado',
      Available: 'Disponible',
      Occupied: 'Ocupada',
      Reserved: 'Reservada',
      // AdminOrders
      'Order Administration': 'Administración de Órdenes',
      'Add Order': 'Agregar Orden',
      'Edit Order': 'Editar Orden',
      'Delete Order': 'Eliminar Orden',
      'Order Status': 'Estado de la Orden',
      Pending: 'Pendiente',
      'In Progress': 'En Progreso',
      Completed: 'Completada',
      Cancelled: 'Cancelada',
      Table: 'Mesa',
      Products: 'Productos',
      Total: 'Total',
      // Dashboard
      Dashboard: 'Dashboard',
      Orders: 'Órdenes',
      'Completed Orders': 'Órdenes Completadas',
      'Total Revenue': 'Ingresos Totales',
      'Orders by Status': 'Órdenes por Estado',
      // Reports
      'Sales Reports': 'Reportes de Ventas',
      'Sales by Day': 'Ventas por Día',
      'Sales by Category': 'Ventas por Categoría',
      'Sales by Product': 'Ventas por Producto',
      'No sales recorded': 'No hay ventas registradas',
      orders: 'órdenes',
      products: 'productos',
      sold: 'vendido',
      // Auth
      Login: 'Iniciar Sesión',
      Logout: 'Cerrar Sesión',
      Email: 'Correo electrónico',
      Password: 'Contraseña',
      Submit: 'Enviar',
      // Navigation
      Home: 'Inicio',
      'Back to Home': 'Volver al Inicio',
    },
  },
  en: {
    translation: {
      // General
      'Loading...': 'Loading...',
      'No data': 'No data',
      // AdminProductos
      'Product Administration': 'Product Administration',
      'Add Product': 'Add Product',
      'Edit Product': 'Edit Product',
      'Delete Product': 'Delete Product',
      'Product Name': 'Product Name',
      Price: 'Price',
      Category: 'Category',
      Actions: 'Actions',
      // AdminMesas
      'Table Administration': 'Table Administration',
      'Add Table': 'Add Table',
      'Edit Table': 'Edit Table',
      'Delete Table': 'Delete Table',
      'Table Number': 'Table Number',
      Status: 'Status',
      Available: 'Available',
      Occupied: 'Occupied',
      Reserved: 'Reserved',
      // AdminOrders
      'Order Administration': 'Order Administration',
      'Add Order': 'Add Order',
      'Edit Order': 'Edit Order',
      'Delete Order': 'Delete Order',
      'Order Status': 'Order Status',
      Pending: 'Pending',
      'In Progress': 'In Progress',
      Completed: 'Completed',
      Cancelled: 'Cancelled',
      Table: 'Table',
      Products: 'Products',
      Total: 'Total',
      // Dashboard
      Dashboard: 'Dashboard',
      Orders: 'Orders',
      'Completed Orders': 'Completed Orders',
      'Total Revenue': 'Total Revenue',
      'Orders by Status': 'Orders by Status',
      // Reports
      'Sales Reports': 'Sales Reports',
      'Sales by Day': 'Sales by Day',
      'Sales by Category': 'Sales by Category',
      'Sales by Product': 'Sales by Product',
      'No sales recorded': 'No sales recorded',
      orders: 'orders',
      products: 'products',
      sold: 'sold',
      // Auth
      Login: 'Login',
      Logout: 'Logout',
      Email: 'Email',
      Password: 'Password',
      Submit: 'Submit',
      // Navigation
      Home: 'Home',
      'Back to Home': 'Back to Home',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'es',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
