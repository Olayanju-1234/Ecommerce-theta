import { Request, Response } from 'express';
import { CreateProduct, UploadProductImage } from '../services/ProductService';
import { errorResponse, successResponse } from '../utils';
import ProductModel from '../models/product.model';
import { IProduct } from '../interface';
import { body, query } from 'express-validator';

export const validateRequests = (method: string) => {
  switch (method) {
    case 'createProduct': {
      return [
        body('name', 'Product name is required')
          .notEmpty()
          .trim()
          .isLength({ max: 100 }),
        body('brand', 'Brand is required')
          .notEmpty()
          .trim()
          .isLength({ max: 50 }),
        body('price', 'Valid price is required').isFloat({ gt: 0 }).toFloat(),
        body('category', 'Category is required').notEmpty().trim(),
        body('description', 'Description is required (10-2000 characters)')
          .notEmpty()
          .isLength({ min: 10, max: 2000 }),
        body('discount_percentage', 'Invalid discount percentage')
          .optional()
          .isFloat({ min: 0, max: 100 })
          .toFloat(),
        body('quantity', 'Quantity must be a positive integer')
          .optional()
          .isInt({ min: 0 }),
        body('size', 'Size must be a string').optional().isString(),
      ];
    }
    default:
      return [];
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      brand,
      price,
      category,
      description,
      discount_percentage,
      quantity,
      size,
      tags,
      reviews,
      quantity_sold,
    }: IProduct = req.body;

    const existingProduct = await ProductModel.findOne({ name });
    if (existingProduct) {
      return errorResponse(res, 409, 'Product with this name already exists');
    }

    if (!req.files?.length) {
      return errorResponse(res, 400, 'At least one product image is required');
    }

    const files = req.files as Express.Multer.File[];
    const images = await Promise.all(
      files.map((file) => UploadProductImage(file.path)),
    );

    const productData: IProduct = {
      name,
      brand,
      price,
      category,
      description,
      images,
      discount_percentage: discount_percentage || 0,
      quantity,
      size: size || undefined,
      tags: tags || [],
      reviews: reviews || [],
      quantity_sold: quantity_sold || 0,
      seller: req.user._id,
    };

    const product = await CreateProduct(productData);

    return successResponse(res, 201, {
      message: 'Product created successfully',
      product,
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};
