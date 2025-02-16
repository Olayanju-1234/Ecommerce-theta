import UserModel from '../../../models/user.model';
import {
  IUserDocument,
  IFilterQuery,
  IFilterOptions,
} from '../../../interface';

export const GetAllUsers = async (
  filter: IFilterQuery,
  options: IFilterOptions,
): Promise<{ users: IUserDocument[]; total: number }> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = options;
  const skip = (page - 1) * limit;
  const sortOptions: { [key: string]: 1 | -1 } = {};

  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  const users = await UserModel.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sortOptions)
    .select('-password')
    .exec();

  const total = await UserModel.countDocuments(filter);

  return { users, total };
};
