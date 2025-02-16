import UserModel from '../../models/user.model';
import { IUserDocument } from '../../interface';
import { hash, compare } from 'bcryptjs';

export const ChangePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
): Promise<IUserDocument | null> => {
  const user = await UserModel.findById(userId).select('+password').exec();
  if (!user) throw new Error('User not found');

  const isMatch = await compare(oldPassword, user.password);
  if (!isMatch) throw new Error('Old password is incorrect');

  user.password = await hash(newPassword, 10);

  await user.save();

  return user;
};
