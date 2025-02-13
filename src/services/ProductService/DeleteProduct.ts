import ProductModel from '../../models/product.model';
import { IProductDocument } from '../../interface';

export const DeleteProduct = async (
  id: string,
): Promise<IProductDocument | null> => {
  return ProductModel.findByIdAndDelete(id).exec();
};
