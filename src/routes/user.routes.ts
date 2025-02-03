import { Router } from 'express';
import { updateAccessLevel, addProfilePic } from '../controllers/user';
import { auth } from '../middlewares';
import validateBody from '../utils/validateBody';
import { Upload } from '../services/Upload/UploadImage';

const router = Router() as any;

router.post('/add-profile-pic', auth, Upload.single('profilePic'), addProfilePic);

export default router;
