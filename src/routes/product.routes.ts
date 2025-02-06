// src/routes/product.routes.ts
import { Router } from 'express';
import { Upload } from '../services/Upload/UploadImage';
import { createProduct, validateRequests } from '../controllers/product';
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

export default router;
