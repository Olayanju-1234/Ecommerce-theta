import { Document } from 'mongoose';
export interface IProduct {
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface IProductDocument extends IProduct, Document {}
