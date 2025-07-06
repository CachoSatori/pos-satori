import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase';
import { useProductos } from '../../contexts/ProductosContext';
import { useAuth } from '../../contexts/useAuth';
import ProtectedRoute from '../auth/ProtectedRoute';
import { Product } from '../../types';
import { useTranslation } from 'react-i18next';

interface ProductForm {
  name: string;
  price: number;
  category?: string;
}

/**
 * Componente para administración de productos.
 * Accesible, mobile-first y alineado a SDD.
 */
const AdminProductos: React.FC = () => {
  useAuth(); // Solo para asegurar contexto, puedes quitar si no usas user
  const { products, loading } = useProductos();
  const [form, setForm] = useState<ProductForm>({ name: '', price: 0, category: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const handleEdit = (product: Product) => {
    setForm({ name: product.name, price: product.price, category: (product as any).category || '' });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" aria-busy="true">
        <span className="text-accent text-xl">{t('Loading products...')}</span>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="bg-[#1C2526] text-[#FFFFFF] min-h-screen p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="bg-[#00A6A6] text-[#FFFFFF] px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#009090] focus:ring-2 focus:ring-[#00A6A6] transition"
          >
            ← Volver al Inicio
          </button>
          <h1 className="text-4xl font-bold ml-6 text-[#00A6A6] drop-shadow">
            {t('Administrar Productos')}
          </h1>
        </div>
        <form
          onSubmit={handleAddOrUpdate}
          className="mb-10 bg-[#16213e] p-8 rounded-xl shadow-lg grid gap-6 max-w-xl mx-auto"
        >
          <input
            type="text"
            name="name"
            placeholder={t('Nombre')}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-4 rounded-xl border border-[#00A6A6] focus:outline-none focus:ring-2 focus:ring-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] placeholder:text-gray-400 text-lg"
            required
          />
          <input
            type="number"
            name="price"
            placeholder={t('Precio')}
            value={form.price === 0 ? '' : form.price}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
            className="p-4 rounded-xl border border-[#00A6A6] focus:outline-none focus:ring-2 focus:ring-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] placeholder:text-gray-400 text-lg"
            required
          />
          <input
            type="text"
            name="category"
            placeholder={t('Categoría')}
            value={form.category || ''}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="p-4 rounded-xl border border-[#00A6A6] focus:outline-none focus:ring-2 focus:ring-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] placeholder:text-gray-400 text-lg"
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-[#00A6A6] text-[#FFFFFF] p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-[#00A6A6] transition text-lg"
            >
              {editingId ? t('Actualizar') : t('Agregar')} {t('Producto')}
            </button>
            {editingId && (
              <button
                type="button"
                className="flex-1 bg-gray-400 text-[#FFFFFF] p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-80 focus:ring-2 focus:ring-gray-400 transition text-lg"
                onClick={() => {
                  setForm({ name: '', price: 0, category: '' });
                  setEditingId(null);
                }}
              >
                {t('Cancelar')}
              </button>
            )}
          </div>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: Product & { category?: string }) => (
            <div
              key={product.id}
              className="bg-[#16213e] p-8 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-2xl transition"
            >
              <div>
                <h2 className="text-2xl font-bold text-[#00A6A6] mb-2">{product.name}</h2>
                <p className="mb-1 text-lg">
                  {t('Precio')}: <span className="font-semibold">${product.price}</span>
                </p>
                <p className="mb-2 text-lg">
                  {t('Categoría')}: <span className="italic">{(product as any).category || t('Sin categoría')}</span>
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-[#00A6A6] text-[#FFFFFF] p-3 rounded-xl font-bold hover:bg-opacity-90 focus:ring-2 focus:ring-[#00A6A6] transition text-lg"
                >
                  {t('Editar')}
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-600 text-[#FFFFFF] p-3 rounded-xl font-bold hover:bg-opacity-90 focus:ring-2 focus:ring-red-600 transition text-lg"
                >
                  {t('Eliminar')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminProductos;

/**
 * Sugerencias de pruebas (Vitest):
 * - Renderiza loading correctamente.
 * - Renderiza lista de productos.
 * - Accesibilidad: aria-busy y roles correctos.
 */