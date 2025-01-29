import { IUser, IProduct } from './index';
import { Document } from 'mongoose';

export interface IReview {
  user: IUser | string;
  product: IProduct | string;
  rating: number;
  comment: string;
}

export interface IReviewDocument extends IReview, Document {}
