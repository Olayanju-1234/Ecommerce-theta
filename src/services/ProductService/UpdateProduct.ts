import ProductModel from '../../models/product.model';
import { IProductDocument } from '../../interface';

export const UpdateProduct = async (
  id: string,
  payload: Partial<IProductDocument>,
): Promise<IProductDocument | null> => {
  return ProductModel.findByIdAndUpdate(id, payload, { new: true }).exec();
};

