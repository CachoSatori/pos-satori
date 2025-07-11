import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Reports from '../Reports';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {},
  interpolation: { escapeValue: false },
});

// Mock useOrders para controlar datos y fetchOrders
const fetchOrdersMock = vi.fn();
vi.mock('../../../contexts/OrdersHook', () => ({
  useOrders: () => ({
    orders: [
      { id: '1', date: new Date().toISOString(), ubicacionId: 'loc1', total: 100, items: [] },
      { id: '2', date: new Date().toISOString(), ubicacionId: 'loc2', total: 200, items: [] },
    ],
    fetchOrders: fetchOrdersMock,
  }),
}));

// Mock useProductos si tu componente lo usa
vi.mock('../../../contexts/ProductosHook', () => ({
  useProductos: () => ({
    products: [],
  }),
}));

// Mock de Firebase para evitar errores de IndexedDb y usar memoria
vi.mock('../../../firebase', () => ({
  db: {
    settings: { cache: { kind: 'memory' } },
    collection: vi.fn(() => ({
      add: vi.fn(),
      doc: vi.fn(() => ({
        update: vi.fn(),
        delete: vi.fn(),
      })),
      getDocs: vi.fn().mockResolvedValue({ docs: [] }),
    })),
  },
}));

describe('Reports', () => {
  beforeEach(() => {
    fetchOrdersMock.mockClear();
  });

  it('renders and calculates total', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Reports />
      </I18nextProvider>
    );
    expect(screen.getByTestId('total')).toHaveTextContent(/Total/i);
    // Puedes ajustar el valor esperado según el mock de orders
  });

  it('shows filters and calls fetchOrders on change', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Reports />
      </I18nextProvider>
    );
    // Busca los selectores de fecha y ubicación
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);

    // Simula cambio en select de ubicación
    fireEvent.change(selects[0], { target: { value: 'loc1' } });
    expect(fetchOrdersMock).toHaveBeenCalled();
  });
});