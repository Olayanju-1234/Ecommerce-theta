import { IUser, IProductDocument } from './';
import { Document } from 'mongoose';
export interface ICart {
  user: IUser | string;
  products: IProductDocument[] | string[];
}

export interface ICartDocument extends ICart, Document {}
