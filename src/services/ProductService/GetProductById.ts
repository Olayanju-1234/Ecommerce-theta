import ProductModel from '../../models/product.model';
import { IProductDocument } from '../../interface';

export const GetProductById = async (
  id: string,
): Promise<IProductDocument | null> => {
  return ProductModel.findById(id).exec();
};
