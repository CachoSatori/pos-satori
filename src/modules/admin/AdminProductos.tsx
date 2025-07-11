import React, { useState } from 'react';
import { useProductos } from '../../contexts/ProductosHook';
import { useAuth } from '../../contexts/AuthHook';
import ProtectedRoute from '../auth/ProtectedRoute';
import type { Product } from '../../types';
import { useTranslation } from 'react-i18next';

/**
 * Componente para administración de productos.
 */
const AdminProductos: React.FC = () => {
  useAuth();
  const { products, setProducts } = useProductos();
  const { t } = useTranslation();
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    price: 0,
    category: '',
  });

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProducts([...products, { ...newProduct, id: crypto.randomUUID() }]);
    setNewProduct({ id: '', name: '', price: 0, category: '' });
  };

  const editProduct = async (product: Product) => {
    setProducts(products.map((p) => (p.id === product.id ? product : p)));
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen p-8 bg-[#1C2526] text-[#FFFFFF]">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#00A6A6]">
          {t('Product Administration')}
        </h1>
        <form
          onSubmit={addProduct}
          className="mb-8 flex flex-wrap gap-4 items-center"
        >
          <input
            type="text"
            placeholder={t('Product Name')}
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="p-4 rounded-xl border-2 border-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] placeholder:text-gray-400"
            required
            aria-label={t('Product Name')}
          />
          <input
            type="number"
            placeholder={t('Price')}
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: Number(e.target.value) })
            }
            className="p-4 rounded-xl border-2 border-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] placeholder:text-gray-400"
            required
            aria-label={t('Price')}
          />
          <input
            type="text"
            placeholder={t('Category')}
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="p-4 rounded-xl border-2 border-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] placeholder:text-gray-400"
            aria-label={t('Category')}
          />
          <button
            type="submit"
            className="bg-[#00A6A6] text-[#FFFFFF] font-bold rounded-xl p-4"
            aria-label={t('Add Product')}
          >
            {t('Add Product')}
          </button>
        </form>
        <ul>
          {products.length === 0 && (
            <li className="text-gray-400">{t('No data')}</li>
          )}
          {products.map((product: Product) => (
            <li key={product.id} className="mb-2 flex items-center">
              <span>
                {product.name} - ${product.price} (
                {product.category || t('No data')})
              </span>
              <button
                className="ml-4 bg-[#00A6A6] text-[#FFFFFF] rounded-xl p-2"
                onClick={() =>
                  editProduct({ ...product, name: `${product.name} (Editado)` })
                }
                aria-label={t('Edit Product')}
              >
                {t('Edit Product')}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
};

export default AdminProductos;

/**
 * Sugerencias de pruebas (Vitest):
 * - Renderiza formulario de productos correctamente.
 * - Agrega y edita productos correctamente.
 * - Accesibilidad: aria-labels presentes.
 */
