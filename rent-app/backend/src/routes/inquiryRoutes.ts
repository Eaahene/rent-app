import { Router } from 'express';
import {
  createInquiry,
  getPropertyInquiries,
  getMyInquiries,
  getLandlordInquiries,
  updateInquiryStatus,
} from '../controllers/inquiryController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createInquirySchema } from '../validators';
import { UserRole } from '../interfaces';

const router = Router();

router.post('/', authenticate, authorize(UserRole.TENANT), validate(createInquirySchema), createInquiry);
router.get('/me', authenticate, authorize(UserRole.TENANT), getMyInquiries);
router.get('/landlord', authenticate, authorize(UserRole.LANDLORD, UserRole.ADMIN), getLandlordInquiries);
router.get('/property/:propertyId', authenticate, authorize(UserRole.LANDLORD, UserRole.ADMIN), getPropertyInquiries);
router.patch('/:id/status', authenticate, authorize(UserRole.LANDLORD, UserRole.ADMIN), updateInquiryStatus);

export default router;
