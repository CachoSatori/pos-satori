export interface Mesa {
  id: string;
  numero: number;
  estado: 'libre' | 'ocupada' | 'reservada';
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