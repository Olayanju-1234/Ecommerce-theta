import UserModel from '../../models/user.model';
import { IUserDocument, IFilterOptions } from '../../interface';

export const SearchUsers = async (
  query: string,
  options: IFilterOptions,
): Promise<{ users: IUserDocument[]; total: number }> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = options;
  const skip = (page - 1) * limit;
  const sortOptions: { [key: string]: 1 | -1 } = {};

  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  const users = await UserModel.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
    ],
  })
    .skip(skip)
    .limit(limit)
    .sort(sortOptions)
    .select('-password')
    .exec();

  const total = await UserModel.countDocuments({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
    ],
  });

  return { users, total };
};
