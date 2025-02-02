import UserModel from '../../models/user.model';

export const UpdateAccessLevel = async (
  userId: string,
  accessLevel: number,
) => {
  if (![1, 2, 3].includes(accessLevel)) {
    throw new Error('Invalid access level');
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  await UserModel.updateOne({ _id: userId }, { access_level: accessLevel });

  return {
    message: 'Access level updated successfully',
    access_level: accessLevel,
  };
};
