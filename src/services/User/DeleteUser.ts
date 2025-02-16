import UserModel from '../../models/user.model';
import { IUserDocument } from '../../interface';

export const DeleteUser = async (id: string): Promise<IUserDocument | null> => {
  return UserModel.findByIdAndDelete(id).exec();
};
