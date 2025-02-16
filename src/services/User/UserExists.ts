import UserModel from '../../models/user.model';

export const CheckUserExists = async (
  field: 'email' | '_id',
  value: string,
): Promise<boolean> => {
  const user = await UserModel.findOne({ [field]: value }).exec();
  return !!user;
};
