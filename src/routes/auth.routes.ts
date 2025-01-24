import { Router } from 'express';
import { localRegistration, validateRequests } from '../controllers/auth';
import { auth } from '../middlewares';
import validateBody from '../utils/validateBody';

const router = Router() as any;

router.post(
  '/signup',
  validateRequests('signup'),
  validateBody,
  localRegistration,
);

export default router;
