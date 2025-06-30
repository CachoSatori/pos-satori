import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../services/firebase';
import { useProductos } from '../../contexts/ProductosContext';

interface ProductForm {
  name: string;
  price: number;
  category: string;
}

const AdminProductos: React.FC = () => {
  const { products, loading } = useProductos();
  const [form, setForm] = useState<ProductForm>({ name: '', price: 0, category: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error('Nombre y precio son requeridos');
      return;
    }
    try {
      if (editingId) {
        const productRef = doc(db, 'products', editingId);
        await updateDoc(productRef, { ...form });
        toast.success('Producto actualizado');
      } else {
        await addDoc(collection(db, 'products'), { ...form });
        toast.success('Producto agregado');
      }
      setForm({ name: '', price: 0, category: '' });
      setEditingId(null);
    } catch (error) {
      toast.error('Error al guardar producto');
      console.error(error);
    }
  };

  const handleEdit = (product: { id: string; name: string; price: number; category?: string }) => {
    setForm({ name: product.name, price: product.price, category: product.category || '' });
    setEditingId(product.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Producto eliminado');
    } catch (error) {
      toast.error('Error al eliminar producto');
      console.error(error);
    }
  };

  if (loading) return <div className="text-text">Cargando...</div>;

  return (
    <div className="bg-primary text-text min-h-screen p-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="bg-accent text-text px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-accent/80 focus:ring-2 focus:ring-accent transition"
        >
          ← Volver al Inicio
        </button>
        <h1 className="text-4xl font-bold ml-6 text-accent drop-shadow">Administrar Productos</h1>
      </div>
      <form
        onSubmit={handleAddOrUpdate}
        className="mb-10 bg-secondary p-8 rounded-xl shadow-lg grid gap-6 max-w-xl mx-auto"
      >
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-4 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-text placeholder:text-gray-400 text-lg"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
          className="p-4 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-text placeholder:text-gray-400 text-lg"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Categoría"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="p-4 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-text placeholder:text-gray-400 text-lg"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-accent text-text p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-accent transition text-lg"
          >
            {editingId ? 'Actualizar' : 'Agregar'} Producto
          </button>
          {editingId && (
            <button
              type="button"
              className="flex-1 bg-gray-400 text-text p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-80 focus:ring-2 focus:ring-gray-400 transition text-lg"
              onClick={() => {
                setForm({ name: '', price: 0, category: '' });
                setEditingId(null);
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-secondary p-8 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-2xl transition"
          >
            <div>
              <h2 className="text-2xl font-bold text-accent mb-2">{product.name}</h2>
              <p className="mb-1 text-lg">
                Precio: <span className="font-semibold">${product.price}</span>
              </p>
              <p className="mb-2 text-lg">
                Categoría: <span className="italic">{product.category || 'Sin categoría'}</span>
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(product)}
                className="flex-1 bg-accent text-text p-3 rounded-xl font-bold hover:bg-opacity-90 focus:ring-2 focus:ring-accent transition text-lg"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="flex-1 bg-danger text-text p-3 rounded-xl font-bold hover:bg-opacity-90 focus:ring-2 focus:ring-danger transition text-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductos;