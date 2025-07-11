import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import { auth } from '../../firebase';

// Mock onAuthStateChanged para simular usuario autenticado
auth.onAuthStateChanged = vi.fn((cb: (user: any) => void) => {
  cb({
    uid: '123',
    email: 'test@example.com',
    getIdTokenResult: vi.fn().mockResolvedValue({ claims: { role: 'admin' } }),
  });
  return vi.fn();
});

describe('AuthContext', () => {
  it('proporciona el contexto de auth a los hijos', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    // Usa matcher de función y elimina parámetro no usado en getByText
    expect(
      screen.getByText((_, element) => element?.textContent === 'test@example.com')
    ).toBeInTheDocument();
  });
});

// Componente de prueba para mostrar el email del usuario autenticado
function TestComponent() {
  const { user } = useAuth();
  return <div>{user?.email}</div>;
}