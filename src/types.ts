export interface Table {
  id: string;
  number: number;
  status: 'available' | 'occupied';
}

export interface Mesa {
  id: string;
  number: number;
  status: 'available' | 'occupied';
}

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}