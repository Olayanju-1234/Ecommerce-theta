import { Router } from 'express';
import { Upload } from '../services/Upload/UploadImage';
import {
  createProduct,
  validateRequests,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} from '../controllers/product';
import { auth } from '../middlewares';
import validateBody from '../utils/validateBody';

const router = Router() as any;

router.post(
  '/',
  auth,
  Upload.array('images', 5),
  validateRequests('createProduct'),
  validateBody,
  createProduct,
);

router.get(
  '/',
  auth,
  validateRequests('getAllProducts'),
  validateBody,
  getAllProducts,
);

router.get(
  '/:id',
  validateRequests('getProductById'),
  validateBody,
  getProductById,
);

router.put(
  '/:id',
  auth,
  Upload.array('images', 5),
  validateRequests('updateProduct'),
  validateBody,
  updateProduct,
);

router.delete(
  '/:id',
  auth,
  validateRequests('deleteProduct'),
  validateBody,
  deleteProduct,
);

export default router;
