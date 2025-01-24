import { Product } from './products.interface';

export interface Cart {
  id: string;
  userId: string;
  products: Product[];
}
