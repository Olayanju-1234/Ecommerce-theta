import ProductModel from '../../models/product.model';
import {
  IProductDocument,
  IFilterQuery,
  IFilterOptions,
} from '../../interface';

export const GetAllProducts = async (
  filter: IFilterQuery,
  options: IFilterOptions,
): Promise<{ products: IProductDocument[]; total: number }> => {
  const { page = 1, limit = 10, sortBy, sortOrder } = options;
  const skip = (page - 1) * limit;
  const sortOptions: { [key: string]: 1 | -1 } = {};

  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  const products = await ProductModel.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sortOptions)
    .exec();

  const total = await ProductModel.countDocuments(filter);

  return { products, total };
};
