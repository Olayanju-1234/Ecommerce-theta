import { Document } from 'mongoose';
export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  access_level: number;
  country: string;
  verifcation_token?: string;
  reset_password_token?: string;
  reset_password_expires?: Date;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserAuth extends IUser, Pick<IUserDocument, '_id'> {
  access_token?: string;
  refresh_token?: string;
}
