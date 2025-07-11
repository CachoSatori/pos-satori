import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { OrdersProvider, useOrders } from '../OrdersContext';

// Mock de Firebase para evitar errores de collection() y getDocs
vi.mock('../../firebase', () => ({
  db: {
    collection: vi.fn((path) => ({
      path,
      getDocs: vi.fn().mockResolvedValue({ docs: [] }),
      add: vi.fn().mockResolvedValue({ id: 'newId' }),
      doc: vi.fn((id) => ({
        update: vi.fn(),
        delete: vi.fn(),
      })),
    })),
  },
}));

describe('OrdersContext', () => {
  it('provee orders y métodos correctamente dentro del provider', () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper: OrdersProvider,
    });
    expect(result.current.orders).toBeDefined();
    expect(typeof result.current.addOrder).toBe('function');
    expect(typeof result.current.updateOrder).toBe('function');
    expect(typeof result.current.deleteOrder).toBe('function');
    expect(typeof result.current.fetchOrders).toBe('function');
  });
});