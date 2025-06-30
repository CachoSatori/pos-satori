import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../services/firebase';
import { useOrders } from '../../contexts/OrdersContext';
import { useProductos } from '../../contexts/ProductosContext';
import { useMesas } from '../../contexts/MesasContext';
import ProtectedRoute from '../auth/ProtectedRoute';

interface OrderForm {
  tableId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  status: string;
}

const PAGE_SIZE = 6;

const AdminOrders: React.FC = () => {
  const { orders, loading } = useOrders();
  const { products } = useProductos();
  const { tables } = useMesas();
  const [form, setForm] = useState<OrderForm>({
    tableId: '',
    items: [],
    status: 'pending',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Search and filter logic
  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (search.trim()) {
      filtered = filtered.filter(order => {
        const mesa = tables.find(t => t.id === order.tableId);
        const mesaMatch = mesa && `Mesa #${mesa.number}`.toLowerCase().includes(search.toLowerCase());
        const productMatch = order.items.some(item =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
        return mesaMatch || productMatch;
      });
    }
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    return filtered;
  }, [orders, search, statusFilter, tables]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAddItem = () => {
    const product = products.find(p => p.id === selectedProduct);
    if (!product || quantity < 1) return;
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
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

  const handleAddOrUpdate = async (e: React.FormEvent) => {
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
    } catch (error) {
      toast.error('Error al guardar orden');
      console.error(error);
    }
  };

  const handleEdit = (order: any) => {
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
    } catch (error) {
      toast.error('Error al eliminar orden');
      console.error(error);
    }
  };

  if (loading) return <div className="text-text">Cargando...</div>;

  return (
    <ProtectedRoute>
      <div className="bg-primary text-text min-h-screen p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="bg-accent text-text px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-accent/80 focus:ring-2 focus:ring-accent transition"
          >
            ← Volver al Inicio
          </button>
          <h1 className="text-4xl font-bold ml-6 text-accent drop-shadow">Administrar Órdenes</h1>
        </div>
        <form
          onSubmit={handleAddOrUpdate}
          className="mb-10 bg-secondary p-8 rounded-xl shadow-lg grid gap-6 max-w-2xl mx-auto"
        >
          <select
            name="tableId"
            value={form.tableId}
            onChange={e => setForm({ ...form, tableId: e.target.value })}
            className="p-4 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-text text-lg"
            required
          >
            <option value="">Selecciona una mesa</option>
            {tables.map(table => (
              <option key={table.id} value={table.id}>
                Mesa #{table.number}
              </option>
            ))}
          </select>
          <div className="flex gap-4 items-end">
            <select
              value={selectedProduct}
              onChange={e => setSelectedProduct(e.target.value)}
              className="flex-1 p-4 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-text text-lg"
            >
              <option value="">Selecciona un producto</option>
              {products.map(product => (
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
              className="w-24 p-4 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-text text-lg"
              placeholder="Cantidad"
            />
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-accent text-text px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-accent/80 focus:ring-2 focus:ring-accent transition text-lg"
              disabled={!selectedProduct}
            >
              Añadir
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Productos en la orden</h2>
            <ul className="mb-4">
              {form.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 mb-2">
                  <span className="flex-1">{item.name} (x{item.quantity})</span>
                  <span className="font-semibold">${item.price * item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="bg-danger text-text px-3 py-1 rounded-xl font-bold shadow hover:bg-opacity-80 focus:ring-2 focus:ring-danger transition text-sm"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
            <div className="font-bold text-lg">
              Total: $
              {form.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
            </div>
          </div>
          <select
            name="status"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            className="p-4 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-text text-lg"
          >
            <option value="pending">Pendiente</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-accent text-text p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-accent transition text-lg"
            >
              {editingId ? 'Actualizar' : 'Agregar'} Orden
            </button>
            {editingId && (
              <button
                type="button"
                className="flex-1 bg-gray-400 text-text p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-80 focus:ring-2 focus:ring-gray-400 transition text-lg"
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
        <div className="bg-secondary rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Buscar por mesa o producto..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 p-4 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-text text-lg"
          />
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="p-4 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-text text-lg"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        {/* Orders grid with pagination */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedOrders.map(order => (
            <div
              key={order.id}
              className="bg-secondary p-8 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-2xl transition"
            >
              <div>
                <h2 className="text-2xl font-bold text-accent mb-2">
                  Mesa #{tables.find(t => t.id === order.tableId)?.number || 'N/A'}
                </h2>
                <p className="mb-2 text-lg">
                  Estado:{' '}
                  <span
                    className={`font-semibold ${
                      order.status === 'completed'
                        ? 'text-accent'
                        : order.status === 'cancelled'
                        ? 'text-danger'
                        : 'text-yellow-400'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </p>
                <ul className="mb-2">
                  {order.items.map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>
                        {item.name} (x{item.quantity})
                      </span>
                      <span>${item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <div className="font-bold text-lg">
                  Total: $
                  {order.items.reduce(
                    (sum: number, item: any) => sum + item.price * item.quantity,
                    0
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(order)}
                  className="flex-1 bg-accent text-text p-3 rounded-xl font-bold hover:bg-opacity-90 focus:ring-2 focus:ring-accent transition text-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="flex-1 bg-danger text-text p-3 rounded-xl font-bold hover:bg-opacity-90 focus:ring-2 focus:ring-danger transition text-lg"
                >
                  Eliminar
                </button>
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
              className="bg-accent text-text px-4 py-2 rounded-xl font-bold shadow hover:bg-accent/80 focus:ring-2 focus:ring-accent transition disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="font-bold text-lg">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="bg-accent text-text px-4 py-2 rounded-xl font-bold shadow hover:bg-accent/80 focus:ring-2 focus:ring-accent transition disabled:opacity-50"
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