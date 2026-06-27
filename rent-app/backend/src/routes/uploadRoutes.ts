import { Router } from 'express';
import { uploadImages, deleteImage, uploadAvatar } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';
import { upload } from '../config/cloudinary';

const router = Router();

router.post('/images', authenticate, upload.array('images', 10), uploadImages);
router.delete('/images/:publicId', authenticate, deleteImage);
router.post('/avatar', authenticate, upload.single('avatar'), uploadAvatar);

export default router;
