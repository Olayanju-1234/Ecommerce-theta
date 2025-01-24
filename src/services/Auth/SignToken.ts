import { sign } from 'jsonwebtoken';
import UserModel from '../../models/user.model';
import { ITokenPayload, IUserDocument, IUserAuth } from '../../interface';
import { config } from '../../config/env';

const { JWT_SECRET, REFRESH_TOKEN_SECRET } = config;

export const SignToken = async (payload: ITokenPayload): Promise<IUserAuth> => {
  let access_token;
  let refresh_token;
  let user: IUserDocument;

  access_token = sign(payload, JWT_SECRET, {
    expiresIn: '14d',
  });

  refresh_token = sign({ _id: payload._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: '28d',
  });

  user = (await UserModel.findByIdAndUpdate(
    payload._id,
    { refresh_token },
    { new: true },
  )
    .select('firstname lastname username email country')
    .lean()
    .exec()) as IUserDocument;

  if (!user) throw new Error('User not found');

  return {
    access_token,
    refresh_token,
    ...user,
  };
};
