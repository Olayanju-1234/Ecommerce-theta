import { Request, Response } from 'express';
import {
  CreateProduct,
  UploadProductImage,
  GetAllProducts,
  GetProductById,
  UpdateProduct,
  DeleteProduct,
} from '../services/ProductService';
import { errorResponse, successResponse } from '../utils';
import ProductModel from '../models/product.model';
import {
  IProduct,
  IFilterOptions,
  IFilterQuery,
  IProductDocument,
} from '../interface';
import { body, query, param } from 'express-validator';

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
    case 'getProductById': {
      return [param('id', 'Invalid product ID').isMongoId()];
    }
    case 'updateProduct': {
      return [
        param('id', 'Invalid product ID').isMongoId(),
        body('name', 'Product name must be up to 100 characters')
          .optional()
          .trim()
          .isLength({ max: 100 }),
        body('brand', 'Brand must be up to 50 characters')
          .optional()
          .trim()
          .isLength({ max: 50 }),
        body('price', 'Valid price is required')
          .optional()
          .isFloat({ gt: 0 })
          .toFloat(),
        body('category', 'Category must be a string').optional().trim(),
        body('description', 'Description must be 10-2000 characters')
          .optional()
          .isLength({ min: 10, max: 2000 }),
        body('discount_percentage', 'Invalid discount percentage')
          .optional()
          .isFloat({ min: 0, max: 100 })
          .toFloat(),
        body('quantity', 'Quantity must be a non-negative integer')
          .optional()
          .isInt({ min: 0 }),
        body('size', 'Size must be a string').optional().isString(),
      ];
    }
    case 'deleteProduct': {
      return [param('id', 'Invalid product ID').isMongoId()];
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

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { access_level, _id } = req.user;
    const { category, brand, minPrice, maxPrice, ...queryParams } = req.query;

    const filter: IFilterQuery = {};

    if (access_level === 2) filter.seller = _id;
    if (category) filter.category = category as string;
    if (brand) filter.brand = brand as string;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
    }

    const options: IFilterOptions = {
      page: parseInt(queryParams.page as string) || 1,
      limit: parseInt(queryParams.limit as string) || 10,
      sortBy: queryParams.sortBy as string,
      sortOrder: queryParams.sortOrder as 'asc' | 'desc',
    };

    const { products, total } = await GetAllProducts(filter, options);

    return successResponse(res, 200, {
      message: 'Products retrieved successfully',
      data: {
        products,
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          totalPages: Math.ceil(total / options.limit!),
        },
      },
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await GetProductById(id);

    if (!product) return errorResponse(res, 404, 'Product not found');
    return successResponse(res, 200, {
      message: 'Product retrieved successfully',
      product,
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload: Partial<IProductDocument> = req.body;
    const { _id, access_level } = req.user;

    const product = await GetProductById(id);
    if (!product) return errorResponse(res, 404, 'Product not found');

    if (access_level !== 3 && product.seller.toString() !== _id.toString()) {
      return errorResponse(res, 403, 'Unauthorized to update this product');
    }

    if (req.files?.length) {
      const files = req.files as Express.Multer.File[];
      const images = await Promise.all(
        files.map((file) => UploadProductImage(file.path)),
      );
      payload.images = images;
    }

    const updatedProduct = await UpdateProduct(id, payload);
    if (!updatedProduct)
      return errorResponse(res, 500, 'Failed to update product');

    return successResponse(res, 200, {
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { _id, access_level } = req.user;

    const product = await GetProductById(id);
    if (!product) return errorResponse(res, 404, 'Product not found');

    if (access_level !== 3 && product.seller.toString() !== _id.toString()) {
      return errorResponse(res, 403, 'Unauthorized to delete this product');
    }

    const deletedProduct = await DeleteProduct(id);
    if (!deletedProduct)
      return errorResponse(res, 500, 'Failed to delete product');

    return successResponse(res, 200, {
      message: 'Product deleted successfully',
      product: deletedProduct,
    });
  } catch (error: any) {
    return errorResponse(res, 500, error.message);
  }
};
