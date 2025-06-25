export interface Product {
  id: string; // ✅ not number
  name: string;
  description: string;
  image: string;
  price: number;
  totalStock: number;
  availableStock?: number;
  reservedStock?: number;
  createdAt?: string;
}
