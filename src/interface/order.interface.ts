import { IProductDocument, IUserDocument } from './';
import { Document } from 'mongoose';
export interface IOrder {
  user: IUserDocument | string;
  products: IProductDocument[] | string[];
  total: number;
  status: string;
}

export interface IOrderDocument extends IOrder, Document {}
