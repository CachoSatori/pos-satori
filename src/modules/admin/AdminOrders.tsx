import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db, logError } from '../../firebase';
import { useOrders } from '../../contexts/OrdersContext';
import { useProductos } from '../../contexts/ProductosContext';
import { useMesas } from '../../contexts/MesasContext';
import { useAuth } from '../../contexts/useAuth';
import ProtectedRoute from '../auth/ProtectedRoute';
import type { Table, Order, OrderItem, Product } from '../../types';

interface OrderForm {
  tableId: string;
  items: OrderItem[];
  status: Order['status'];
}

const PAGE_SIZE = 6;

const AdminOrders: React.FC = () => {
  const { orders, loading } = useOrders();
  const { products } = useProductos();
  const { tables } = useMesas();
  useAuth();
  const [form, setForm] = useState<OrderForm>({
    tableId: '',
    items: [],
    status: 'pending',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | ''>('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Search and filter logic
  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (search.trim()) {
      filtered = filtered.filter((order: Order) => {
        const table = tables.find((t: Table) => t.id === order.tableId);
        const tableMatch = table && `Mesa #${table.number}`.toLowerCase().includes(search.toLowerCase());
        const productMatch = order.items.some((item: OrderItem) =>
          (item.productId
            ? products.find(p => p.id === item.productId)?.name ?? 'Producto'
            : 'Producto'
          ).toLowerCase().includes(search.toLowerCase())
        );
        return tableMatch || productMatch;
      });
    }
    if (statusFilter) {
      filtered = filtered.filter((order: Order) => order.status === statusFilter);
    }
    return filtered;
  }, [orders, search, statusFilter, tables, products]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAddItem = () => {
    if (!selectedProduct || quantity < 1) return;
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          productId: selectedProduct,
          quantity,
        },
      ],
    });
    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });
  };

  const handleAddOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.tableId || form.items.length === 0) {
      toast.error('Selecciona una mesa y al menos un producto');
      return;
    }
    try {
      if (editingId) {
        const orderRef = doc(db, 'orders', editingId);
        await updateDoc(orderRef, { ...form });
        toast.success('Orden actualizada');
      } else {
        await addDoc(collection(db, 'orders'), {
          ...form,
          createdAt: Timestamp.now(),
        });
        toast.success('Orden agregada');
      }
      setForm({ tableId: '', items: [], status: 'pending' });
      setEditingId(null);
    } catch (error: unknown) {
      toast.error('Error al guardar orden');
      logError(error as Error);
    }
  };

  const handleEdit = (order: Order) => {
    setForm({
      tableId: order.tableId,
      items: order.items,
      status: order.status,
    });
    setEditingId(order.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta orden?')) return;
    try {
      await deleteDoc(doc(db, 'orders', id));
      toast.success('Orden eliminada');
    } catch (error: unknown) {
      toast.error('Error al eliminar orden');
      logError(error as Error);
    }
  };

  const handleChangeStatus = async (order: Order, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', order.id), { status: newStatus });
      toast.success(`Estado cambiado a ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      toast.error('Error al cambiar estado');
      logError(error as Error);
    }
  };

  if (loading) return <div className="text-text">Cargando...</div>;

  return (
    <ProtectedRoute allowedRoles={['admin', 'waiter']}>
      <div className="bg-[#1C2526] text-[#FFFFFF] min-h-screen p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="bg-[#00A6A6] text-[#FFFFFF] px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#009090] focus:ring-2 focus:ring-[#00A6A6] transition"
          >
            ← Volver al Inicio
          </button>
          <h1 className="text-4xl font-bold ml-6 text-[#00A6A6] drop-shadow">Administrar Órdenes</h1>
        </div>
        <form
          onSubmit={handleAddOrUpdate}
          className="mb-10 bg-[#16213e] p-8 rounded-xl shadow-lg grid gap-6 max-w-2xl mx-auto"
        >
          <select
            name="tableId"
            value={form.tableId}
            onChange={e => setForm({ ...form, tableId: e.target.value })}
            className="p-4 rounded-xl border border-[#00A6A6] focus:outline-none focus:ring-2 focus:ring-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] text-lg"
            required
          >
            <option value="">Selecciona una mesa</option>
            {tables.map((table: Table) => (
              <option key={table.id} value={table.id}>
                Mesa #{table.number}
              </option>
            ))}
          </select>
          <div className="flex gap-4 items-end">
            <select
              value={selectedProduct}
              onChange={e => setSelectedProduct(e.target.value)}
              className="flex-1 p-4 rounded-xl border border-[#00A6A6] focus:outline-none focus:ring-2 focus:ring-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] text-lg"
            >
              <option value="">Selecciona un producto</option>
              {products.map((product: Product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (${product.price})
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="w-24 p-4 rounded-xl border border-[#00A6A6] focus:outline-none focus:ring-2 focus:ring-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] text-lg"
              placeholder="Cantidad"
            />
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-[#00A6A6] text-[#FFFFFF] px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#009090] focus:ring-2 focus:ring-[#00A6A6] transition text-lg"
              disabled={!selectedProduct}
            >
              Añadir
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Productos en la orden</h2>
            <ul className="mb-4">
              {form.items.map((item, idx) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <li key={idx} className="flex items-center gap-4 mb-2">
                    <span className="flex-1">
                      {product ? product.name : 'Producto eliminado'} (x{item.quantity})
                    </span>
                    <span className="font-semibold">
                      ${product ? (product.price * item.quantity).toFixed(2) : '0.00'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="bg-red-600 text-[#FFFFFF] px-3 py-1 rounded-xl font-bold shadow hover:bg-opacity-80 focus:ring-2 focus:ring-red-600 transition text-sm"
                    >
                      Quitar
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="font-bold text-lg">
              Total: $
              {form.items.reduce((sum, item) => {
                const product = products.find(p => p.id === item.productId);
                return sum + (product ? product.price * item.quantity : 0);
              }, 0).toFixed(2)}
            </div>
          </div>
          <select
            name="status"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value as Order['status'] })}
            className="p-4 rounded-xl border border-[#00A6A6] focus:outline-none focus:ring-2 focus:ring-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] text-lg"
          >
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-[#00A6A6] text-[#FFFFFF] p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-[#00A6A6] transition text-lg"
            >
              {editingId ? 'Actualizar' : 'Agregar'} Orden
            </button>
            {editingId && (
              <button
                type="button"
                className="flex-1 bg-gray-400 text-[#FFFFFF] p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-80 focus:ring-2 focus:ring-gray-400 transition text-lg"
                onClick={() => {
                  setForm({ tableId: '', items: [], status: 'pending' });
                  setEditingId(null);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {/* Search and filter controls */}
        <div className="bg-[#16213e] rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Buscar por mesa o producto..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 p-4 rounded-xl border border-[#00A6A6] focus:outline-none focus:ring-2 focus:ring-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] text-lg"
          />
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value as Order['status'] | '');
              setPage(1);
            }}
            className="p-4 rounded-xl border border-[#00A6A6] focus:outline-none focus:ring-2 focus:ring-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] text-lg"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        {/* Orders grid with pagination */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedOrders.map((order: Order) => (
            <div
              key={order.id}
              className="bg-[#16213e] p-8 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-2xl transition"
            >
              <div>
                <h2 className="text-2xl font-bold text-[#00A6A6] mb-2">
                  Mesa #{tables.find((t: Table) => t.id === order.tableId)?.number || 'N/A'}
                </h2>
                <p className="mb-2 text-lg">
                  Estado:{' '}
                  <span
                    className={`font-semibold ${
                      order.status === 'completed'
                        ? 'text-[#00A6A6]'
                        : order.status === 'cancelled'
                        ? 'text-red-600'
                        : order.status === 'in_progress'
                        ? 'text-yellow-400'
                        : 'text-yellow-400'
                    }`}
                  >
                    {order.status === 'pending'
                      ? 'Pendiente'
                      : order.status === 'in_progress'
                      ? 'En Progreso'
                      : order.status === 'completed'
                      ? 'Completada'
                      : 'Cancelada'}
                  </span>
                </p>
                <ul className="mb-2">
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item: OrderItem, idx: number) => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <li key={idx} className="flex justify-between">
                          <span>
                            {product ? product.name : 'Producto eliminado'} (x{item.quantity})
                          </span>
                          <span>
                            ${product ? (product.price * item.quantity).toFixed(2) : '0.00'}
                          </span>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-gray-400 italic">Sin productos</li>
                  )}
                </ul>
                <div className="font-bold text-lg">
                  Total: $
                  {Array.isArray(order.items) && order.items.length > 0
                    ? order.items.reduce(
                        (sum: number, item: OrderItem) => {
                          const product = products.find(p => p.id === item.productId);
                          return sum + (product ? product.price * item.quantity : 0);
                        },
                        0
                      ).toFixed(2)
                    : '0.00'}
                </div>
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => handleEdit(order)}
                  style={{
                    padding: '16px',
                    fontSize: '18px',
                    borderRadius: '8px',
                    backgroundColor: '#00A6A6',
                    color: '#fff',
                    border: '1px solid #00A6A6'
                  }}
                  className="flex-1 font-bold shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-[#00A6A6] transition text-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  style={{
                    padding: '16px',
                    fontSize: '18px',
                    borderRadius: '8px',
                    backgroundColor: '#00A6A6',
                    color: '#fff',
                    border: '1px solid #00A6A6'
                  }}
                  className="flex-1 font-bold shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-red-600 transition text-lg"
                >
                  Eliminar
                </button>
                {/* Botones de cambio de estado */}
                {order.status !== 'pending' && (
                  <button
                    onClick={() => handleChangeStatus(order, 'pending')}
                    className="flex-1 bg-yellow-400 text-[#1C2526] p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-yellow-400 transition text-lg"
                  >
                    Marcar como Pendiente
                  </button>
                )}
                {order.status !== 'in_progress' && (
                  <button
                    onClick={() => handleChangeStatus(order, 'in_progress')}
                    className="flex-1 bg-yellow-400 text-[#1C2526] p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-yellow-400 transition text-lg"
                  >
                    En Progreso
                  </button>
                )}
                {order.status !== 'completed' && (
                  <button
                    onClick={() => handleChangeStatus(order, 'completed')}
                    className="flex-1 bg-[#00A6A6] text-[#FFFFFF] p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-[#00A6A6] transition text-lg"
                  >
                    Marcar como Completada
                  </button>
                )}
                {order.status !== 'cancelled' && (
                  <button
                    onClick={() => handleChangeStatus(order, 'cancelled')}
                    className="flex-1 bg-red-600 text-[#FFFFFF] p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-red-600 transition text-lg"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="bg-[#00A6A6] text-[#FFFFFF] px-4 py-2 rounded-xl font-bold shadow hover:bg-[#009090] focus:ring-2 focus:ring-[#00A6A6] transition disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="font-bold text-lg">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="bg-[#00A6A6] text-[#FFFFFF] px-4 py-2 rounded-xl font-bold shadow hover:bg-[#009090] focus:ring-2 focus:ring-[#00A6A6] transition disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AdminOrders;