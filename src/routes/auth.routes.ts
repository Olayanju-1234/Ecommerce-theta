import { Router } from 'express';
import {
  localRegistration,
  validateRequests,
  localLogin,
  resetPassword,
  forgotPassword,
  verifyEmail,
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

router.post(
  '/forgot-password',
  validateRequests('forgotPassword'),
  validateBody,
  forgotPassword,
);

router.post(
  '/reset-password',
  validateRequests('resetPassword'),
  validateBody,
  resetPassword,
);

router.get('/verify-email', validateRequests('verifyEmail'), verifyEmail);

export default router;
