import { IUserDocument, IProductDocument } from './';
import { Document } from 'mongoose';
export interface ICart {
  user: string;
  products: IProductDocument[] | string[];
}

export interface ICartDocument extends ICart, Document {}
