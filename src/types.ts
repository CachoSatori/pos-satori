export interface OrderItem {
  productId: string;
  name?: string;
  price?: number;
  quantity: number;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Table {
  id: string;
  number: number | string;
  status: 'available' | 'occupied' | 'reserved';
}

export interface Product {
  id: string;
  name: string;
  price: number;
}