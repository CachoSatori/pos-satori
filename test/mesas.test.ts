import React from 'react';
import { renderHook } from '@testing-library/react';
import { MesasProvider, useMesas } from '../src/contexts/MesasContext';
import { describe, it, expect } from 'vitest';
import { collection, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../src/firebase';
import type { Table } from '../src/types';

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
      'useMesas debe usarse dentro de MesasProvider'
    );
  });

  it('provee mesas y loading correctamente dentro del provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => 
      React.createElement(MesasProvider, null, children);
    const { result } = renderHook(() => useMesas(), { wrapper });
    expect(result.current).toHaveProperty('tables');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('setTables');
  });
});

/**
 * Sugerencias adicionales:
 * - Mockear onSnapshot para pruebas unitarias puras.
 * - Probar cambios en el estado de mesas.
 */