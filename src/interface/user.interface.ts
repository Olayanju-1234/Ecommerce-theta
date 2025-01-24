import { Document } from 'mongoose';
export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  access_level: number;
  country: string;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserAuth extends IUser, Pick<IUserDocument, 'id'> {
  access_token: string;
  refresh_token: string;
}
