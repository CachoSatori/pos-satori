import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductosProvider, useProductos } from '../ProductosContext';

// Mock de Firebase para evitar errores de IndexedDb y usar memoria
vi.mock('../../firebase', () => ({
  db: {
    collection: vi.fn((path) => ({
      path,
      getDocs: vi.fn().mockResolvedValue({ docs: [] }),
    })),
  },
}));

describe('ProductosContext', () => {
  it('provee productos y métodos correctamente dentro del provider', () => {
    const { result } = renderHook(() => useProductos(), {
      wrapper: ProductosProvider,
    });
    expect(result.current.products).toBeDefined();
    expect(typeof result.current.addProduct).toBe('function');
    expect(typeof result.current.updateProduct).toBe('function');
    expect(typeof result.current.deleteProduct).toBe('function');
    expect(typeof result.current.fetchProducts).toBe('function');
  });

  it('provee fetchProducts como función en el contexto', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      <ProductosProvider>{children}</ProductosProvider>;
    const { result } = renderHook(() => useProductos(), { wrapper });
    expect(typeof result.current.fetchProducts).toBe('function');
  });
});