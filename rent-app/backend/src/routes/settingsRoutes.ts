import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../interfaces';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticate, authorize(UserRole.ADMIN), updateSettings);

export default router;
