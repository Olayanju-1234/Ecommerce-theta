import { nanoid } from 'nanoid';
import UserModel from '../../models/user.model';

export const ForgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const reset_password_token = nanoid(10);

  user.reset_password_token = reset_password_token;
  user.reset_password_expires = new Date(Date.now() + 3600000);
  await user.save();
  return user;
};
