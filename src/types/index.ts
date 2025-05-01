
export interface Location {
  id: string;
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  wholesalePrice: number;
  suggestedRetailPrice: number;
  description?: string;
  imageUrl?: string;
}

export interface DeliveryItem {
  productId: string;
  quantity: number;
  pricePerUnit: number;
}

export interface Delivery {
  id: string;
  locationId: string;
  date: string;
  items: DeliveryItem[];
  notes?: string;
  isPaid: boolean;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  locationId: string;
  date: string;
  items: OrderItem[];
  status: 'pending' | 'delivered' | 'cancelled';
  notes?: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  pricePerUnit: number;
}

export interface Sale {
  id: string;
  locationId: string;
  date: string;
  items: SaleItem[];
  notes?: string;
}

export interface DataStore {
  locations: Location[];
  products: Product[];
  deliveries: Delivery[];
  orders: Order[];
  sales: Sale[];
}
