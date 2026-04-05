import { IProductDocument, IUserDocument } from './';
import { Document } from 'mongoose';

export interface IOrderItem {
  product: IProductDocument | string;
  quantity: number;
  price_at_purchase: number;
}

export interface IOrder {
  buyer: IUserDocument | string;
  seller: IUserDocument | string;
  items: IOrderItem[];
  subtotal: number;
  platform_fee: number;
  total: number;
  status: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'unpaid' | 'paid' | 'refunded' | 'partially_refunded';
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  stripe_transfer_id?: string;
  shipping_address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
}

export interface IOrderDocument extends IOrder, Document {}
