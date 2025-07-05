import type { Timestamp } from 'firebase/firestore';

// Representa un producto individual
export interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
}

// Representa un ítem de una orden (solo referencia al producto por ID y cantidad)
export interface OrderItem {
  productId: string;
  quantity: number;
}

// Representa una mesa en el sistema
export interface Table {
  id: string;
  number: number;
  status: 'available' | 'occupied' | 'reserved';
}

// Representa una orden realizada en el sistema
export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Timestamp;
}