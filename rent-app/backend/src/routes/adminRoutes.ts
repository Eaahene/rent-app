import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  verifyLandlord,
  getAllProperties,
  getPropertyById,
  approveProperty,
  deleteProperty,
  toggleFeatured,
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../interfaces';

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/landlords/:id/verify', verifyLandlord);
router.get('/properties', getAllProperties);
router.get('/properties/:id', getPropertyById);
router.patch('/properties/:id/approve', approveProperty);
router.delete('/properties/:id', deleteProperty);
router.patch('/properties/:id/featured', toggleFeatured);

export default router;
