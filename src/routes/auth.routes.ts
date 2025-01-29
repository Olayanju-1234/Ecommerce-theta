import { Router } from 'express';
import {
  localRegistration,
  validateRequests,
  localLogin,
} from '../controllers/auth';
import { auth } from '../middlewares';
import validateBody from '../utils/validateBody';

const router = Router() as any;

router.post(
  '/signup',
  validateRequests('signup'),
  validateBody,
  localRegistration,
);

router.post('/login', validateRequests('login'), validateBody, localLogin);

export default router;
