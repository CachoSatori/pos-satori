import { describe, it, expect } from 'vitest';
import { collection, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../src/firebase';
import type { Product } from '../src/types';

// Utilidad para limpiar después de la prueba
async function cleanupProducto(id: string) {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch {
    // Ignorar si ya fue borrado
  }
}

describe('Firestore Productos', () => {
  it('permite crear y editar un producto', async () => {
    // Crear producto
    const producto: Omit<Product, 'id'> = { name: 'Vitest Producto', price: 123.45 };
    const productoRef = await addDoc(collection(db, 'products'), producto);
    const productoId = productoRef.id;

    // Verificar creación
    const snap = await getDoc(doc(db, 'products', productoId));
    expect(snap.exists()).toBe(true);
    expect(snap.data()?.name).toBe('Vitest Producto');
    expect(snap.data()?.price).toBe(123.45);

    // Editar producto
    await updateDoc(doc(db, 'products', productoId), { price: 543.21 });
    const snapEdit = await getDoc(doc(db, 'products', productoId));
    expect(snapEdit.data()?.price).toBe(543.21);

    // Cleanup
    await cleanupProducto(productoId);
  });
});