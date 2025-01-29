import { Document } from 'mongoose';
import { IReview } from './reviews.interface';
import { ITag } from './tags.interface';
export interface IProduct {
  name: string;
  rating?: number;
  brand: string;
  price: number;
  discount_percentage?: number;
  size?: string;
  category: string;
  tags?: ITag[];
  description: string;
  image: string;
  reviews?: IReview[];
}

export interface IProductDocument extends IProduct, Document {}
