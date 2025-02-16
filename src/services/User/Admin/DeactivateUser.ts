import UserModel from '../../../models/user.model';
import { IUserDocument } from '../../../interface';

export const DeactivateUser = async (
  id: string,
): Promise<IUserDocument | null> => {
  return UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true })
    .select('-password')
    .exec();
};

export const ReactivateUser = async (
  userId: string,
): Promise<IUserDocument | null> => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { isActive: true },
    { new: true },
  )
    .select('-password')
    .exec();

  if (!user) throw new Error('User not found');
  return user;
};
