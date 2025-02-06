import { Document } from 'mongoose';
import { IReviewDocument, ITagDocument, IUser } from '../interface';
export interface IProduct {
  name: string;
  rating?: number;
  brand: string;
  price: number;
  discount_percentage?: number;
  size?: string;
  category: string;
  tags?: string[] | ITagDocument[];
  description: string;
  images: string[];
  reviews?: IReviewDocument[];
  quantity?: number;
  quantity_sold?: number;
  seller: IUser | string;
}

export interface IProductDocument extends IProduct, Document {}
