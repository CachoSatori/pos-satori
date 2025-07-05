import { describe, it, expect, beforeAll } from 'vitest';
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