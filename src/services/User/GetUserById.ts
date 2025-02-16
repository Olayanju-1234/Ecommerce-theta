import UserModel from '../../models/user.model';
import { IUserDocument } from '../../interface';

export const GetUser = async (id: string): Promise<IUserDocument | null> => {
  return UserModel.findById(id).select('-password').lean();
};
