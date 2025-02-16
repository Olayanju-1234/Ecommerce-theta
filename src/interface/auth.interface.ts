import { IUserAuth } from './user.interface';
import { Types } from 'mongoose';

export interface ISignUpPayload {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  country?: string;
}

export interface ISignUpResponse {
  status: string;
  user: IUserAuth;
}

export interface ITokenPayload {
  _id: Types.ObjectId;
  access_level: number;
}

export interface IUserAuthInfoRequest {
  _id: string;
  access_level: number;
}
