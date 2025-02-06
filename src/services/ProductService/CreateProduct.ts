import ProductModel from '../../models/product.model';
import { IProduct, IProductDocument } from '../../interface';

export const CreateProduct = async (
  payload: IProduct,
): Promise<IProductDocument> => {
  const product = new ProductModel(payload);
  await product.save();
  return product;
};
