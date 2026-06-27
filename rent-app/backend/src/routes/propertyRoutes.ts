import { Router } from 'express';
import {
  getProperties,
  getPropertyById,
  getSimilarProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  toggleFavorite,
  getMyFavorites,
  checkFavorite,
  getFeaturedProperties,
  getRecentProperties,
} from '../controllers/propertyController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createPropertySchema,
  updatePropertySchema,
  propertySearchSchema,
} from '../validators';
import { UserRole, PropertyStatus } from '../interfaces';

const router = Router();

// Public routes
router.get('/', validate(propertySearchSchema), getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/recent', getRecentProperties);
router.get('/:id', getPropertyById);
router.get('/:id/similar', getSimilarProperties);

// Protected - Landlord routes
router.post('/', authenticate, authorize(UserRole.LANDLORD, UserRole.ADMIN), validate(createPropertySchema), createProperty);
router.patch('/:id', authenticate, authorize(UserRole.LANDLORD, UserRole.ADMIN), validate(updatePropertySchema), updateProperty);
router.delete('/:id', authenticate, authorize(UserRole.LANDLORD, UserRole.ADMIN), deleteProperty);
router.get('/landlord/me', authenticate, authorize(UserRole.LANDLORD, UserRole.ADMIN), getMyProperties);

// Protected - Favorites
router.post('/:propertyId/favorite', authenticate, toggleFavorite);
router.get('/user/favorites', authenticate, getMyFavorites);
router.get('/:propertyId/check-favorite', authenticate, checkFavorite);

export default router;
