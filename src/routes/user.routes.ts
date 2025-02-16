import { Router } from 'express';
import { auth } from '../middlewares';
import validateBody from '../utils/validateBody';
import {
  validateRequests,
  getUser,
  deleteUser,
  changePassword,
  updateUserAccessLevel,
  addProfilePic,
  deactivateUser,
  reactivateUser,
  searchUsers,
  getUserProfile,
  getAllUsers,
} from '../controllers/user';
import { Upload } from '../services/Upload/UploadImage';

const router = Router() as any;

router.get('/profile', auth, getUserProfile);

router.get('/:id', auth, validateRequests('getUser'), validateBody, getUser);

router.delete(
  '/:id',
  auth,
  validateRequests('deleteUser'),
  validateBody,
  deleteUser,
);

router.post(
  '/change-password',
  auth,
  validateRequests('changePassword'),
  validateBody,
  changePassword,
);

router.put(
  '/:id/access-level',
  auth,
  validateRequests('updateUserAccessLevel'),
  validateBody,
  updateUserAccessLevel,
);
router.post('/profile-pic', auth, Upload.single('profilePic'), addProfilePic);

router.put(
  '/:id/deactivate',
  auth,
  validateRequests('deactivateUser'),
  validateBody,
  deactivateUser,
);

router.put(
  '/:id/reactivate',
  auth,
  validateRequests('reactivateUser'),
  validateBody,
  reactivateUser,
);

router.get(
  '/search',
  auth,
  validateRequests('searchUsers'),
  validateBody,
  searchUsers,
);

router.get(
  '/',
  auth,
  validateRequests('getAllUsers'),
  validateBody,
  getAllUsers,
);

export default router;
