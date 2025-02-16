import { authenticator } from 'otplib';
import UserModel from '../../models/user.model';
import { IUserDocument } from '../../interface';

export const Enable2FA = async (userId: string): Promise<string> => {
  const user = await UserModel.findById(userId).exec();
  if (!user) throw new Error('User not found');

  const secret = authenticator.generateSecret();
  user.twofa = secret;
  await user.save();

  return authenticator.keyuri(user.email, 'YourAppName', secret);
};

export const Disable2FA = async (
  userId: string,
): Promise<IUserDocument | null> => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { twofa: null },
    { new: true },
  ).exec();

  if (!user) throw new Error('User not found');
  return user;
};

export const Verify2FA = async (
  userId: string,
  token: string,
): Promise<boolean> => {
  const user = await UserModel.findById(userId).exec();
  if (!user || !user.twofa) throw new Error('2FA not enabled');

  return authenticator.verify({ token, secret: user.twofa });
};
