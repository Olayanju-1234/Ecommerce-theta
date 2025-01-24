import { Product } from './products.interface';

export interface Order {
  id: string;
  userId: string;
  products: Product[];
  total: number;
  status: string;
}
