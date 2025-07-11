/// <reference types="vitest/globals" />
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { MesasProvider } from '../src/contexts/MesasContext';
import { useMesas } from '../src/contexts/MesasHook';
import { describe, it, expect } from 'vitest';
import { collection, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../src/firebase';
import type { Table } from '../src/types';

// El test ya es correcto si la interfaz y el provider están bien definidos.
// Si quieres tests unitarios puros, puedes mockear onSnapshot así:
import { vi } from 'vitest';
vi.mock('../src/firebase', () => ({
  db: {
    collection: vi.fn(() => ({
      onSnapshot: vi.fn((_, cb) => {
        cb({ docs: [] });
        return () => {};
      }),
    })),
  },
}));

// Utilidad para limpiar después de la prueba
async function cleanupMesa(id: string) {
  try {
    await deleteDoc(doc(db, 'tables', id));
  } catch {
    // Ignorar si ya fue borrado
  }
}

describe('Firestore Mesas', () => {
  it('permite crear y editar una mesa', async () => {
    // Crear mesa
    const mesa: Omit<Table, 'id'> = { number: 99, status: 'available' };
    const mesaRef = await addDoc(collection(db, 'tables'), mesa);
    const mesaId = mesaRef.id;

    // Verificar creación
    const snap = await getDoc(doc(db, 'tables', mesaId));
    expect(snap.exists()).toBe(true);
    expect(snap.data()?.number).toBe(99);
    expect(snap.data()?.status).toBe('available');

    // Editar mesa
    await updateDoc(doc(db, 'tables', mesaId), { status: 'occupied' });
    const snapEdit = await getDoc(doc(db, 'tables', mesaId));
    expect(snapEdit.data()?.status).toBe('occupied');

    // Cleanup
    await cleanupMesa(mesaId);
  });
});

describe('useMesas', () => {
  it('lanza error si se usa fuera de MesasProvider', () => {
    expect(() => renderHook(() => useMesas())).toThrow(
      /useMesas debe usarse dentro de MesasProvider/
    );
  });

  it('provee mesas y loading correctamente dentro del provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(MesasProvider, null, children);
    const { result } = renderHook(() => useMesas(), { wrapper });
    expect(result.current.mesas).toEqual([]);
    expect(result.current.loading).toBe(true);
  });
});

/**
 * Sugerencias adicionales:
 * - Mockear onSnapshot para pruebas unitarias puras.
 * - Probar cambios en el estado de mesas.
 */