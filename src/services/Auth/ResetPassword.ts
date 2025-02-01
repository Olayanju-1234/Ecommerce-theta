import UserModel from '../../models/user.model';
import { hash } from 'bcryptjs';

export const ResetPassword = async (
  reset_password_token: string,
  password: string,
) => {
  const user = await UserModel.findOne({ reset_password_token });
  if (!user || !user.reset_password_expires) {
    throw new Error('Invalid or expired reset password token');
  }
  const hashedPassword = await hash(password, 10);
  user.password = hashedPassword;
  user.reset_password_token = undefined;
  user.reset_password_expires = undefined;
  await user.save();
  return user;
};
