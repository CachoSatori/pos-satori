import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { MesasProvider, useMesas } from '../MesasContext';

// Mock de Firebase para evitar errores de IndexedDb y usar memoria
vi.mock('../../firebase', () => ({
  db: {
    collection: vi.fn((path) => ({
      path,
      getDocs: vi.fn().mockResolvedValue({ docs: [] }),
    })),
  },
}));

describe('useMesas', () => {
  it('provee mesas y loading correctamente dentro del provider', () => {
    const { result } = renderHook(() => useMesas(), {
      wrapper: MesasProvider,
    });
    expect(result.current.mesas).toBeDefined();
    expect(result.current.loading).toBeDefined();
  });
});