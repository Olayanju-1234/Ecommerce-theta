import { Document, Types } from 'mongoose';
export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  access_level: number;
  country: string;
  is_verified?: boolean;
  is_active?: boolean;
  verification_token?: string;
  reset_password_token?: string;
  reset_password_expires?: number;
  profile_picture?: string;
  twofa?: string;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

export interface IUserAuth extends IUser, Pick<IUserDocument, '_id'> {
  access_token?: string;
  refresh_token?: string;
}
